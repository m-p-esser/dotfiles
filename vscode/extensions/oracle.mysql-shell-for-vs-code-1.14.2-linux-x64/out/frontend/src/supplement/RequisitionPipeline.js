"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequisitionPipeline = void 0;
class RequisitionPipeline {
    hub;
    static offeringTime = 30;
    static announceInterval = 100;
    pendingRequests = [];
    announceTimer;
    watchDog;
    announcePromise;
    nextJobId = 0;
    constructor(hub) {
        this.hub = hub;
        hub.register("job", this.addJob);
    }
    addJob = (job) => {
        this.pendingRequests.push(...job.map((request) => {
            return {
                ...request,
                jobId: this.nextJobId,
            };
        }));
        ++this.nextJobId;
        if (!this.announceTimer) {
            this.announceTimer = setInterval(this.announceRequest, RequisitionPipeline.announceInterval);
        }
        return Promise.resolve(true);
    };
    announceRequest = () => {
        if (this.announcePromise) {
            return;
        }
        if (this.pendingRequests.length > 0) {
            const request = this.pendingRequests[0];
            this.announcePromise = this.hub.execute(request.requestType, request.parameter);
            this.announcePromise.then((value) => {
                if (value) {
                    this.removeTopRequest();
                }
                else {
                    this.announcePromise = undefined;
                }
            }).catch((e) => {
                console.error(e);
                this.removeTopRequest();
            });
            if (!this.watchDog) {
                this.watchDog = setTimeout(() => {
                    this.cancelCurrentJob();
                }, RequisitionPipeline.offeringTime * 1000);
            }
        }
    };
    removeTopRequest = () => {
        if (this.watchDog) {
            clearTimeout(this.watchDog);
            this.watchDog = undefined;
        }
        this.announcePromise = undefined;
        this.pendingRequests.shift();
        if (this.pendingRequests.length === 0 && this.announceTimer) {
            clearInterval(this.announceTimer);
            this.announceTimer = undefined;
        }
    };
    cancelCurrentJob = () => {
        if (this.watchDog) {
            clearTimeout(this.watchDog);
            this.watchDog = undefined;
        }
        else {
            return;
        }
        this.announcePromise = undefined;
        const current = this.pendingRequests.shift();
        if (current) {
            while (this.pendingRequests.length > 0 && this.pendingRequests[0].jobId === current.jobId) {
                this.pendingRequests.shift();
            }
        }
        if (this.pendingRequests.length === 0 && this.announceTimer) {
            clearInterval(this.announceTimer);
            this.announceTimer = undefined;
        }
    };
}
exports.RequisitionPipeline = RequisitionPipeline;
//# sourceMappingURL=RequisitionPipeline.js.map