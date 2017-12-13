var mongoose = require('mongoose');
var TotalSchema = new mongoose.Schema({
  title: String,
  total: {type: Number, default: 0},
  balance: {type: Number, default: 0},
  percentage: {type: String, default: 0},
  add: {type: Number, default: 0},
  color: {type: String, default: "red"},
  description: String
});

TotalSchema.methods.updateBalance = function(cb) {
	this.balance += this.add;
	if(this.balance >= this.total)
	{
		this.color = "green";
	}
	
	var b = this.balance;
	var t = this.total;
	var p = Math.round((((b/t) * 100) * 100) / 100);
	this.percentage = p.toString() + '%';
	this.save(cb);
}

mongoose.model('Total', TotalSchema);

