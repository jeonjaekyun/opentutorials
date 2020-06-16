var jeon = {
    name:'jeon',
    height:177,
    weight:75,
    BMI:function(){
        bmi = this.weight / (this.height*this.height) * 10000
        return Math.round(bmi);
    }
}

console.log('jeon.BMI() :',jeon.BMI());