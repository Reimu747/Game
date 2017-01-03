var Property = (function () {
    function Property(name, value) {
        this.name = name;
        this.value = value;
        //this.isRate = isRate;
    }
    var d = __define,c=Property,p=c.prototype;
    p.getDescription = function () {
        return this.name + ": + " + this.value;
    };
    return Property;
}());
egret.registerClass(Property,'Property');
var Properties = (function () {
    function Properties() {
        this.all = [new Property("攻击", 100)];
    }
    var d = __define,c=Properties,p=c.prototype;
    p.getAtkDescription = function () {
        return this.atk.getDescription();
    };
    p.getDefDescription = function () {
        return this.def.getDescription();
    };
    p.getProperty = function (propertyName) {
        return this.all[propertyName];
    };
    return Properties;
}());
egret.registerClass(Properties,'Properties');
var PropertyName;
(function (PropertyName) {
    PropertyName[PropertyName["STR"] = 0] = "STR";
    PropertyName[PropertyName["CON"] = 1] = "CON";
    PropertyName[PropertyName["DEX"] = 2] = "DEX";
    PropertyName[PropertyName["MAG"] = 3] = "MAG";
    PropertyName[PropertyName["SPD"] = 4] = "SPD";
})(PropertyName || (PropertyName = {}));
var PropertiesDisplayUtils = (function () {
    function PropertiesDisplayUtils() {
    }
    var d = __define,c=PropertiesDisplayUtils,p=c.prototype;
    PropertiesDisplayUtils.createAllPropertiesDecription = function (properties) {
        var container = new egret.DisplayObjectContainer();
        for (var _i = 0, _a = properties.all; _i < _a.length; _i++) {
            var p = _a[_i];
            var tf = new egret.TextField();
            tf.text = PropertiesDisplayUtils.getDescription(p);
            container.addChild(tf);
        }
        return container;
    };
    PropertiesDisplayUtils.getDescription = function (property, color) {
        if (property.isRate) {
            var textColor = property.value >= 500 ? "red" : "green";
            return property.name + ": +<red>" + (property.value / 10).toFixed(2);
        }
        else {
            return property.name + ": + " + property.value;
        }
    };
    return PropertiesDisplayUtils;
}());
egret.registerClass(PropertiesDisplayUtils,'PropertiesDisplayUtils');
//# sourceMappingURL=Property.js.map