
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                "userlist" : docs
            });
        });    
    };
    
};
exports.newuser = function(req, res){
  res.render('newuser', { title: 'Add New User' });
};
exports.login = function(req, res){
  res.render('login', { title: 'Login Page' });
};

exports.checklogin = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        var pwd = req.body.pwd;

        // Set our collection
        var collection = db.get('reg');

        // Submit to the DB
        collection.find({
            "uname" : userName,
            "pwd" : pwd
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("userlist");
                // And forward to success page
                res.redirect("userlist");
            }
        });

    }
}





exports.addproject = function(req, res){
  res.render('addproject', { title: 'Add New Project' });
};





exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the "name" attributes
        var userName = req.body.username;
        var userEmail = req.body.useremail;

        // Set our collection
        var collection = db.get('usercollection');

        // Submit to the DB
        collection.insert({
            "username" : userName,
            "email" : userEmail
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                //res.location("userlist");
                // And forward to success page
                res.redirect("userlist");
            }
        });

    }
}
exports.newproject = function(db) {
    return function(req, res) {
        var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ");
        // Get our form values. These rely on the "name" attributes
        var title = req.body.txtTitle;
        var url = req.body.txtUrl;
        var desc = req.body.txtShortDesc;
        var keys = req.body.hdKeyId;
        var developer = req.body.hdId;
        var modifyDate = datetime;
        var createdDate = datetime;
        var is_Active = req.body.chkActive;

        // Set our collection
        var collection = db.get('newproject');

        // Submit to the DB
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
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                //res.location("userlist");
                // And forward to success page
                res.redirect("projectlist");
            }
        });

    }
}


exports.autocomplete = function(db) {
    return function(req, res) {
        var developer=req.query.q;
        var collection = db.get('developers');
        collection.find({
            "name" :  new RegExp(developer)
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem getting the information from the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                
                // And forward to success page
                res.json(doc);
            }
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
                // If it worked, set the header so the address bar doesn't still say /adduser
                
                // And forward to success page
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
        var collection = db.get('newproject');
        collection.find({
            "KEYS": new RegExp(key)
        },function(e,docs){
            res.render('projectlist', {
                "projectlist" : docs
            });
        });    
    };
    
};

exports.newkeyword=function(db)
{
    return function(req, res) {
        var key=req.query.key;
         var collection = db.get('keywords');

        // Submit to the DB
        collection.insert({
            "name" : key
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                //res.location("userlist");
                // And forward to success page
               res.json('done');
               
            }
        });

    };
};