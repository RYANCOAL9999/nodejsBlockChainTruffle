var _ = require('underscore'),
	util = require('util'),
	crypto = require('crypto'),
	querystring = require('querystring'),
	url = require('url'),
	dateFormat = require('dateformat');


module.exports = _;


_.str = require('underscore.string');
_.querystring = querystring;
_.url = url;
_.date = dateFormat;
_.mixin(_.str.exports());

//Custome function
_.mixin({
  	trim : function(str){
  		return str.replace(/^\s+|\s+$/g, '');
  	},
  	md5 : function(str){
  		return crypto.createHash('md5').update(str).digest('hex');
  	},
  	sha1 : function(str){
  		return crypto.createHash('sha1').update(str).digest('hex');
  	},
  	base64_encode : function(str){ 
  		return new Buffer(str).toString('base64'); 
  	},
	now : function(){
		return _.date(new Date, 'yyyy-mm-dd HH:MM:ss');
	},
	inherits : function(sub_class, super_class){
		util.inherits(sub_class, super_class);
	},
	log : function(obj){
		util.log(obj);
	},
	//override
	isEmpty : function(obj) {
	    	if (obj == null) return true;
	    	if ( _.isNumber(obj) ) return false;
	    	if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
	    	if (_.isBoolean(obj)) return false; //Added
	    	for (var key in obj) if (_.has(obj, key)) return false;
	    	return true;
	},
	isInt : function(str){
		var intRegex = /^\d+$/;
		return intRegex.test(str);
	},
	callBackNull : function(callback)
	{
		if(callback)
		{
			return callback;
		}
		return null;
	},
	generalFormArray : function(index, array, concatArray)
	{
		var newArray = [];
		if(index)
		{
			for(let i = 0; i < index;i++)
			{
				for(let j = 0; j < array.length;j++)
				{
					newArray.push(array[j]+i);
				}
			}
		}
		return newArray.concat(concatArray);
	},
	generalFormObject : function(array, object)
	{
		var newObject = {};
		if(array && object){
			for(let i  = 0; i < array.length;i++)
			{
				var key = array[i];
				if(object.hasOwnProperty(key))
				{
					newObject[key] = object[key];
				}
			}
		}
		return newObject;
	}
});

