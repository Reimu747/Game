var TaskService = (function () {
    function TaskService() {
        this.taskList = {};
        this.observerList = [];
        TaskService.count++;
        if (TaskService.count > 1) {
            throw "singleton!!!";
        }
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    p.getTaskByCustomRule = function () {
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.CAN_SUBMIT)
                return task;
        }
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.ACCEPTABLE)
                return task;
        }
    };
    p.getNextTask = function () {
        for (var id in this.taskList) {
            var task = this.taskList[id];
            if (task.status == TaskStatus.UNACCEPTABLE)
                return task;
        }
    };
    p.accept = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (task.id == id) {
            task.status = TaskStatus.DURING;
            task.onAccept();
            console.log("任务状态" + task.status);
            this.notify(this.taskList[id]);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.MISSING_TASK;
        }
    };
    p.finish = function (id) {
        if (!id) {
            return ErrorCode.MISSING_TASK;
        }
        var task = this.taskList[id];
        if (task.id == id) {
            console.log("finish");
            task.status = TaskStatus.SUBMITED;
            this.notify(this.taskList[id]);
            return ErrorCode.SUCCESS;
        }
        else {
            return ErrorCode.MISSING_TASK;
        }
    };
    p.notify = function (task) {
        // console.log("111");
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    p.addTask = function (task) {
        this.taskList[task.id] = task;
    };
    p.addObserver = function (observer) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    };
    TaskService.count = 0;
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService',["EventEmitter"]);
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["MISSING_TASK"] = 1] = "MISSING_TASK";
    ErrorCode[ErrorCode["REPEAT_OBSERVER"] = 2] = "REPEAT_OBSERVER";
})(ErrorCode || (ErrorCode = {}));
//# sourceMappingURL=TaskService.js.map