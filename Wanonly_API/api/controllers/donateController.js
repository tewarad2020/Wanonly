const mongoose = require('mongoose');
const donate_request = mongoose.model('donate');

exports.send_request = (req, res) => {
    const newDonate = new donate_request(req.body);
    
    newDonate.save((err, donate) => {
        // console.log(err);
        if (err) res.send(err);
        res.json(donate);
    });
    
}

exports.get_user_donate_req = (req, res) => {
    donate_request.find({ username: req.params.userID}, (err, donates)=> {
        if (err) res.send(err);
        res.json(donates);
    }) 
}

exports.get_all_donate_req = (req, res) => {
    donate_request.find({}, (err, donates)=> {
        // console.log(donates)
        if (err) res.send(err);
        res.json(donates);
    }) 
}

exports.update_a_request = (req, res) => {
    console.log(req.body)
    donate_request.findOneAndUpdate(
        {filename: req.params.filename},
        req.body,
        { new : true },
        (err, donate_req) => {
            if (err) res.send(err);
            res.json(donate_req);
        }
    )
}

exports.delete_donate = (req, res) => {
    // console.log(req.params)
    donate_request.deleteOne( { filename: req.params.filename } , err => {
        if (err) res.send(err);
        res.json({
            message: 'ebook successfully deleted', 
            name: req.params.name
        })
    })

    
}

