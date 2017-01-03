var Task = (function () {
    function Task(id, name, condition) {
        this._current = 0;
        this._id = id;
        this._name = name;
        this._condition = condition;
    }
    var d = __define,c=Task,p=c.prototype;
    p.checkStatus = function () {
        if (this._status == TaskStatus.DURING &&
            this._current >= this.total) {
            this._status = TaskStatus.CAN_SUBMIT;
        }
        TaskService.getInstance().notify(this);
    };
    d(p, "condition"
        ,function () {
            return this._condition;
        }
    );
    d(p, "status"
        ,function () {
            return this._status;
        }
        ,function (value) {
            this._status = value;
        }
    );
    d(p, "id"
        ,function () {
            return this._id;
        }
        ,function (id) {
            this._id = id;
        }
    );
    d(p, "name"
        ,function () {
            return this._name;
        }
        ,function (name) {
            this._name = name;
        }
    );
    p.getcurrent = function () {
        return this._current;
    };
    p.setcurrent = function (current) {
        this._current = current;
        this.checkStatus();
    };
    p.onAccept = function () {
        this._condition.onAccept(this);
    };
    return Task;
}());
egret.registerClass(Task,'Task',["TaskConditionContext"]);
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITED"] = 4] = "SUBMITED";
})(TaskStatus || (TaskStatus = {}));
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition() {
    }
    var d = __define,c=KillMonsterTaskCondition,p=c.prototype;
    p.onAccept = function (task) {
        task.setcurrent(task.getcurrent());
    };
    p.onSubmit = function (task) {
    };
    p.onChange = function (task) {
        var temp = task.getcurrent();
        temp++;
        task.setcurrent(temp);
    };
    return KillMonsterTaskCondition;
}());
egret.registerClass(KillMonsterTaskCondition,'KillMonsterTaskCondition',["TaskConditon","Observer"]);
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    var d = __define,c=NPCTalkTaskCondition,p=c.prototype;
    p.onAccept = function (task) {
        //task.current++;
        // var temp = 0;
        // temp = task.getcurrent();
        task.setcurrent(1);
    };
    p.onSubmit = function (task) {
    };
    p.onChange = function (task) {
    };
    return NPCTalkTaskCondition;
}());
egret.registerClass(NPCTalkTaskCondition,'NPCTalkTaskCondition',["TaskConditon"]);
//# sourceMappingURL=Task.js.map