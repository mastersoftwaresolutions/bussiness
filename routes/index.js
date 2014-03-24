
/*
 * GET home page.
 */

 // to connect mysql
var connection = require('../db.js').localConnect();
connection.connect();

exports.addproject = function(req, res){
  res.render('addproject', { title: 'Add New Project' });
};

exports.newproject = function(db) {
    return function(req, res) {
        var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        // Get our form values. These rely on the "name" attributes
        var title = req.body.txtTitle;
        var url = req.body.txtUrl;
        var desc = req.body.txtShortDesc;
        var keys = req.body.hdKeyId;
        var developer = req.body.hdId;
        var modifyDate = datetime;
        var createdDate = datetime;
        var is_Active = req.body.chkActive;
        var _id=req.body.hdnId;
        console.log('_id',_id);

        // add new keywords in db 
        var keyList=keys.split(',');
        var document_ids = [];
        var keyCollection=db.get('keywords');
       
        for(var k in keyList){
            (function(ky)
            {
                keyCollection.find({'name':ky},function(err,doc){   
                    if(doc.length>0){}else{
                    keyCollection.insert({'name':ky});
                }
               });
                })(keyList[k]);
          
        }

        // Set our collection
        var collection = db.get('newproject');
        if(_id =="0"){
        collection.insert({
            "TITLE" : title,
            "URL" : url,
            "DESC":desc,
            "KEYS":keys,
            "DEVELOPER":developer,
            "CREATEDDATE":createdDate,
            "MODIFYDATE":modifyDate,
            "ISACTIVE":is_Active
        }, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                res.location("addproject");
                res.render('addproject', {title:'Add New Project', msg: 'Project added successfully.' });
            }
        });
    }
    else
    {
        collection.update({'_id':_id},{$set:{
            "TITLE" : title,
            "URL" : url,
            "DESC":desc,
            "KEYS":keys,
            "DEVELOPER":developer,
            "CREATEDDATE":createdDate,
            "MODIFYDATE":modifyDate,
            "ISACTIVE":is_Active
        }}, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                res.location("editproject");
                res.render('addproject', {title:'Edit Project', msg: 'Project updated successfully.' });
                }
            });
        }

    }
}
    

exports.autocomplete = function(db) {
    return function(req, res) {
        // using mysql to get developers list
        var developer=req.query.q;
        connection.query('SELECT  Employee_ID as id,FullName as name FROM employees where FullName LIKE "%'+developer+'%"' , function(err , lot){
            if (err) console.log(err);
            console.log('lot',lot);
        res.json(lot);
        });
    }
}

exports.keyautocomplete = function(db) {
    return function(req, res) {
        var key=req.query.q;
        var collection = db.get('keywords');
        collection.find({
            "name" :  new RegExp(key)
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem getting the information from the database.");
            }
            else {
                if(doc.length>0)
                {               
                res.json(doc);
            }
            else{
                res.json([{'id':'1','name':key}]);
            }
            }
        });

    }
}

exports.searchautocomplete = function(db) {
    return function(req, res) {
        var key=req.query.q;
        console.log('search',key);
        var collection = db.get('keywords');
        collection.find({
            "name" :  new RegExp(key)
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem getting the information from the database.");
            }
            else {                            
                res.json(doc);            
            }
        });

    }
}

exports.search = function(req, res){
  res.render('search', { title: '' });
};

exports.searchproject = function(db) {
    return function(req, res) {
     res.location("projectlist?key="+req.body.hdKeyId);
     res.redirect("projectlist?key="+req.body.hdKeyId);
    };
}

exports.projectlist = function(db) {
    return function(req, res) {
        var key=req.query.key;
        
        console.log('keys',key)
        if(key=="undefined"){
         res.render('projectlist', {
            "projectlist" : docs,"msg":"No Project Found."
        });
        }
        else{
        var collection = db.get('newproject');
        collection.find({$query: {
            KEYS: new RegExp(key)
        }, $orderby: { CREATEDDATE : -1 } },function(e,docs){
            if(docs.length>0){
            res.render('projectlist', {
                "projectlist" : docs,"msg":""
            });
        }
        else{
            res.render('projectlist', {
            "projectlist" : docs,"msg":"No Project Found."
        });
        }
        });    
    }
    };
    
};


exports.deleteproject=function(db)
{
    return function(req,res){
    var id=req.query.key;

    var collection=db.get('newproject');
    collection.remove({'_id':id
     }, function (err, doc){ 
    if(err)
    res.json({'status':'0'});
    else
    res.json({'status':"1"})
      });
    //res.redirect("projectlist?key="+returnkey);
    };
};

exports.editproject=function(req, res)
{
  //  res.json('done');
    res.redirect('edit?key='+req.query.key);
};
exports.edit= function(db)
{
    return function(req,res)
    {
        var id=req.query.key;
        console.log('id',id)
        var collection=db.get('newproject');
        collection.find({'_id':id},
            function(err,doc){
                console.log('editproject',doc);
                if(!err)
                res.render('editproject',{'title':'Edit Project','project':doc});
            });
    };
};
