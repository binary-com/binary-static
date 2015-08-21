var Offerings = Object.create(Offerings);
Object.defineProperties(Offerings,{
	contractForms:{
		value:function(){
			parent = Object.getPrototypeOf(this);
			var forms = parent.contractForms();
			delete forms['risefall']
			return forms
		}
	}
})