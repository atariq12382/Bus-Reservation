module.exports = {
    ensureAuthenticated: function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash('error_msg', 'Login to view this web page');
        res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next)
    {
        if(!req.isAuthenticated())
        {
            return next();
        }
        res.redirect('/dashboard');
    }
};