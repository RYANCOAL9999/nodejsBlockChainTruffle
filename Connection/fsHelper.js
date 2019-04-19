let _fs     =   require('fs');
let _https  =   require('https');

class fsHelper
{
    constructor()
    {

    }

    /**
     * 
     * @param {*} path 
     * @param {*} url 
     */
    static downloadFile(path, url)
    {
        return new Promise((resolve)=>{
            var file = _fs.createWriteStream(path);
            _https.get(url, async (response)=>{
                response.pipe(file);
                file.on('finish', function() {
                    file.close(function(error){
                        resolve(true);
                    });
                })
            })
        })
    }

    /**
     * 
     * @param {*} path 
     * @param {*} content 
     */
    static writeFileAsync(path, content)
    {
        return new Promise((resolve)=>{
            _fs.writeFile(path, content, function(err){
                var success = false;
                if(!err)
                {
                    success = true;
                }
                resolve(success);
            })
        })
    }

    /**
     * 
     * @param {*} path 
     * @param {*} encoding 
     */
    static readFileAsync(path, encoding)
    {
        return new Promise((resolve)=>{
            _fs.readFile(path, encoding, function(err, data){
                var successData = undefined;
                if(!err)
                {
                    successData = data;
                }
                resolve(successData);
            })
        })
    }

    /**
     * 
     * @param {*} path 
     */
    static fileExistAsync(path)
    {
        return new Promise((resolve)=>{
            _fs.exists(path, function(exists){
                resolve(exists);
            })
        })
    }

}

module.exports = fsHelper;