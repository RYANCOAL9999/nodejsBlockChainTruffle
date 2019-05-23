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
		return concatArray.concat(newArray);
	},
	generalFormObject : function(array, object)
	{
		var newObject = {};
		if(array && object){
			for(let i  = 0; i < array.length;i++)
			{
				var key = array[i];
				if(object[key])
				{
					newObject[key] = object[key];
				}
			}
		}
		return newObject;
	},
	convectorArrayToObjectWithKey:function(resultList)
	{
		var answerList = {};
		for(var result of resultList)
		{
			if(result){
                var keyList = Object.keys(result);
                keyList.forEach((key)=>{
                   if(key != "")
                   {
                      answerList[key] = result[key];
                   }
                })
			}
		}
		return answerList;	
	},
    checkHeader:function(headers, headersObject, accessUserObject)
    {
		var result = true;
		if(!accessUserObject)
		{
			delete headersObject["x-kconsultingpro-user"];
			delete headersObject["x-kconsultingpro-password"];
		}
		
        for(var key in headersObject)
        {
            if(!headers[key])
            {
                result = false;
                break;
            }
            else
            {
                if(headersObject[key] === 'Any')
                {
                    continue;
				}
				else if(headersObject[key] === 'default')
				{
					if(accessUserObject)
					{
						var names = key.split('-');
						var name = names[names.length - 1];
						if(accessUserObject[name] !== headers[key])
						{
							result = false;
							break;
						}
					}
				}
                else if(headers[key]  !== headersObject[key])
                {
                    result = false;
                    break;
				}
            }
        }
        return result;
        
    }


});

