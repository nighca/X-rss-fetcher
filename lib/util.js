var emptyFn = function(){};

var type = Object.prototype.toString.call.bind(Object.prototype.toString);

var forEach = function(obj, method){
    if(type(obj) === '[object Array]'){
        for(var i = 0, l = obj.length; i < l && method.call(this, obj[i], i) !== false; i++);
        return;
    }

    for(var key in obj) if(obj.hasOwnProperty(key) && method.call(this, obj[key], key) === false) return;
};

var transform = function(obj, method){
    if(!obj) return obj;
    var target = new obj.constructor();
    forEach(obj, function(val, key){method(target, val, key)});
    return target;
};

var map = function(obj, method){
    return transform(obj, function(target, val, key){target[key] = method ? method(val, key) : val});
};

var filter = function(obj, method){
    return transform(obj, function(target, val, key){if(method(val, key)) target[key] = val});
};

var clone = map;

var extend = function(target, addon, alone){
    target = (alone ? clone(target) : target) || {};
    forEach(addon, function(val, key){target[key] = val;});
    return target;
};

// [function(function(err, result)), ...], function(err, result) -> null
var finish = function(tasks, callback) {
    var left = tasks.length,
        results = [],
        over = false;

    callback = callback || emptyFn;

    if(!left){
        callback(null, results);
        return;
    }

    tasks.forEach(function(task, i){
        task(function(err, result){
            if(over){
                return;
            }

            if(err){
                over = true;
                callback(err, results);
            }else{
                results[i] = result;

                left--;

                if(!left){
                    callback(null, results);
                }
            }
        });
    });
};

// 'a${x}c', {x:'b'} -> 'abc'
var format = function(template, vars) {
    return template.replace(/\$\{([^\{\}]*)\}/g, function(_, name) {
        var value = vars[name.trim()];
        return value == null ? '' : value + '';
    });
};

// '<xxx>' -> '&lt;xxx&gt;'
var encodeHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

// '&lt;xxx&gt;' -> '<xxx>'
var decodeHTML = function (source) {
    return String(source)
        .replace(/&lt;/g,'<')
        .replace(/&gt;/g,'>')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g,"'");
};

// '<p>a<span>b</span>c</p>' -> 'abc'
var getText = function(cnt){
    return decodeHTML(
        String(cnt)
            .replace(/\<[^\>]+\>/g, '')
            .replace(/&nbsp;/g, ' ')
    );
};

var parseDate = function(d){
    d = d || null;
    if(d){
        try{
            d = Date.parse(d) || null;
        }catch(e){
            d = null;
        }
    }
    return d;
};

module.exports = {
    emptyFn: emptyFn,
    type: type,
    forEach: forEach,
    map: map,
    filter: filter,
    clone: clone,
    extend: extend,
    finish: finish,
    format: format,
    encodeHTML: encodeHTML,
    decodeHTML: decodeHTML,
    getText: getText,
    parseDate: parseDate
};