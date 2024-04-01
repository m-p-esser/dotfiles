import importlib
import importlib.util
import inspect
import sys
from re import sub
from pathlib import Path
from typing import Callable, Dict, Literal, Union
import json
from typing import Any
import socket
import json
import os
from pydantic import BaseModel
from nivis.sdk.core.definition.model import ProjectDefinition
from nivis.sdk.core.inspect.inspector import inspector
from nivis.sdk.core.inspect.tracer import Tracer
from nivis.sdk.core.compilation.compile import compile
from nivis.sdk.core.resolution.resolve import resolve


class _DefinitionsTracer(Tracer):
    definitions: Dict[str, ProjectDefinition]

    def __init__(self) -> None:
        self.definitions = dict()

    def is_tracing(self) -> bool:
        return True

    def on_project_defined(self, project: ProjectDefinition):
        self.definitions[project.name] = project


class BaseResponse(BaseModel):
    type: str
    uuid: str


class Handshake(BaseResponse):
    type: Literal["handshake"] = "handshake"


class Success(BaseResponse):
    type: Literal["response"] = "response"
    uuid: str
    data: Any


class Error(BaseResponse):
    type: Literal["response"] = "response"
    uuid: str
    error: str


Response = Union[Handshake, Success, Error]

HOST = "127.0.0.1"

end_replace: Callable[[str, str, str], str] = lambda p, sub_str, s: sub(
    "{0}$".format(p), sub_str, s
)
start_replace: Callable[[str, str, str], str] = lambda p, sub_str, s: sub(
    "^{0}".format(p), sub_str, s
)

init_modules = sys.modules.keys()


def get_module_name_from_file(file: str):
    name = start_replace(Path.cwd().joinpath("src").as_posix(), "", file)
    name = start_replace("/", "", name)
    name = end_replace(".py", "", name)
    name = name.replace("/", ".")
    return name


def load_module(file: str):
    tracer = _DefinitionsTracer()
    with inspector(tracer):
        importlib.invalidate_caches()
        name = get_module_name_from_file(file)
        for m in sys.modules.keys():
            if m not in init_modules:
                del sys.modules[m]
        sys.path.append(os.path.dirname(os.path.abspath(file)))
        spec = importlib.util.spec_from_file_location(name, file)
        if spec is None or spec.loader is None:
            return
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return tracer.definitions


def send_json(conn: socket, obj: Response):
    conn.sendall(bytes(obj.model_dump_json(), encoding="utf-8"))


def main(file: str, port: str, uuid: str):
    conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    conn.connect((HOST, int(port)))
    send_json(conn, Handshake(uuid=uuid))

    definitions = load_module(file)

    def req_reload(msg):
        nonlocal definitions
        definitions = load_module(file)
        return {}

    def req_visualize(msg):
        project = definitions[msg["data"]["pipeline"]]

        assert isinstance(project, ProjectDefinition)

        compiled = compile(project)
        resolved = resolve(compiled)

        return resolved

    def req_list(msg):
        return {"pipelines": list(definitions.keys())}

    handlers = {"reload": req_reload, "list": req_list, "visualize": req_visualize}

    while True:
        str = conn.recv(16384).decode("utf-8")
        msg = json.loads(str)
        if msg["type"] == "request":
            handler = handlers[msg["action"]]
            if handler:
                try:
                    res = handler(msg)
                    send_json(conn, Success(uuid=uuid, data=res))
                except Exception as e:
                    send_json(conn, Error(uuid=uuid, error=e.__str__()))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python nivis_inspector.py <file> <port> <uuid> ...]")
        sys.exit(1)

    file = sys.argv[1]
    port = sys.argv[2]
    uuid = sys.argv[3]
    result = main(file, port, uuid)
