module.exports.labho=function(){
    return new Promise(function(resolve,reject){
        var photos;
        fs.readdir("./public/photos/facilities", function(err, items) {
            if(err){
                reject(err);
            }else{
                photos.push(items);
                fs.readdir("./public/photos/premises", function(err, items1) {
                    if(err){
                        reject(err);
                    }else{
                        photos.push(items1);
                        fs.readdir("./public/photos/staff", function(err, items2) {
                            if(err){
                                reject(err);
                            }else{
                                photos.push(items2);
                                resolve(photos);
                            }
                        });
                    }
                });
            }
        });
    });
}