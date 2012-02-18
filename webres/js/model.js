var dateModel = {
		today:null,
		setToday:function(val){
			this.today = val;
			console.log("dateModel.setToday(). this.today=" + this.today); 
		}
};

var weightModel = {
		weightSetInDb:false,
		latestId:0,
		latestSampleDate:null,
		latestWeight:0,
		tempWeight:0,
		weightDelta: null,
		setValues: function(id, sampleDate, weight){
			this.latestId = id;
			this.latestSampleDate = sampleDate;
			this.latestWeight = weight;
			this.tempWeight = weight;
			this.weightSetInDb = true;
			console.log("weightModel.setValues(). this.latestId=" + this.latestId 
					+ " this.latestSampleDate=" + this.latestSampleDate +  " this.latestWeight=" + this.latestWeight); 
		},
		setWeightDelta: function(delta){
			this.weightDelta = delta;
		},
		getWeightDeltaToString: function(){
			if(this.weightDelta ==null){
				return "Enter daily to realize...";
			}else{
				if(this.weightDelta < 0){
					return "" + this.weightDelta;
				}else if (this.weightDelta == 0){
					return "&#177\;0";
				}else{
					return "+" + this.weightDelta;
				}
			}
		},
		setTempWeight: function(weight){
			console.log("Setting temporary weight: " + weight);
			this.tempWeight = weight;
		},
		resetTempWeight: function(){
			console.log("Resetting temporary weight to latest known weight: " + this.latestWeight);
			this.tempWeight = this.latestWeight;
		},
		isWeightChanged: function(){
			return this.latestWeight != this.tempWeight;
		}
};

var charityModel = {
		totalSum:0,
		tempCharitySum:0,
		setValues: function(sum){
			this.totalSum = sum;
			this.tempCharitySum = 0;
			console.log("charitytModel.setValues(). this.sum=" + this.sum + ", this.tempCharitySum=" + this.tempCharitySum); 
		},
		setTempCharitySum: function(sum){
			console.log("Setting temporary charity sum: " + sum);
			this.tempCharitySum = sum;
		},
		resetTempCharitySum: function(){
			console.log("Resetting temporary charity sum 0");
			this.tempCharitySum = 0;
		},
		isTempCharitySumChanged: function(){
			return this.tempCharitySum != 0;
		}
};

var goodWeightModelState = {
		htmlBodyLoaded:false,
		setHtmlBodyLoaded:function(isLoaded){
			console.log("goodWeightModelState.htmlBodyLoaded");
			this.htmlBodyLoaded = true;
			this.trueThat("htmlBody");
			this.fireEvent();
		},
		setDateModelPopulated:function(isPopulated){
			console.log("goodWeightModelState.dateModelPopulated");
			this.trueThat("dateModel");
			this.fireEvent();
		},
		setWeightModelPopulated:function(isPopulated){
			console.log("goodWeightModelState.weightModelPopulated");
			this.trueThat("weightModel");
			this.fireEvent();
		},
		setWeightDeltaPopulated: function(isPopulated){
			console.log("goodWeightModelState.weightDeltaPopulated");
			this.trueThat("weightModel_weightDelta");
			this.fireEvent();
		},
		setWeightModelReady: function(isReady){
			console.log("goodWeightModelState.weightModelReady");
			this.trueThat("weightModelReady");
			this.fireEvent();
		},
		setCharityModelReady: function(isReady){
			console.log("goodWeightModelState.charityModelReady");
			this.trueThat("charityModelReady");
			this.fireEvent();
		},
		setCharityModelPopulated:function(isPopulated){
			console.log("goodWeightModelState.charityModelPopulated");
			this.trueThat("charityModel");
			this.fireEvent();
		},
		eventListeners:[],
		addEventListener:function(listenerName,modelArray,func){
			for(var i = modelArray.length - 1; i > 0; i--){
				modelArray.splice(i,0,false);
			}
			this.eventListeners[listenerName] = {modelArray:modelArray,func:func};
			console.log("addEventListener" + this.eventListeners[listenerName]);
		},
		removeEventListener:function(listenerName){
			console.log("removeEventListener, before:" + this.eventListeners[listenerName]);
			delete this.eventListeners[listenerName];
			console.log("removeEventListener, after:" + this.eventListeners[listenerName]);
		},
		trueThat:function(modelName){
			var modelArray;
			for(var listenerName in this.eventListeners){
				console.log("Inside trueThat('" + modelName + "')");
				modelArray = this.eventListeners[listenerName].modelArray;
				for(var modelIndex = 0; modelIndex < modelArray.length; modelIndex++){
					if(typeof(modelArray[modelIndex]) == 'string'){
						if(modelArray[modelIndex] == modelName){
							modelArray[modelIndex + 1] = true;
						}
					}
				}
			}
		},
		fireEvent:function(){
			var modelCount;
			var modelsToTarget;
			var modelArray;
			var modelName;
			for(var listenerName in this.eventListeners){
				modelCount = 0;
				console.log("fireEvent. listenerObj=" + listenerName);
				modelArray = this.eventListeners[listenerName].modelArray;
				modelsToTarget = modelArray.length/2;
				for(var modelIndex = 0; modelIndex < modelArray.length; modelIndex += 2){
					modelName = modelArray[modelIndex];
					console.log("fireEvent. modelName=" + modelName);
					if(modelName == "htmlBody"){
						if(this.htmlBodyLoaded == true ){
							modelArray[modelIndex + 1] = true;
							modelCount++;
						}
					}
					if(modelName == "dateModel"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelName == "weightModel"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelName == "weightModel_weightDelta"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelName == "weightModelReady"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelName == "charityModel"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelName == "charityModelReady"){
						if(modelArray[modelIndex + 1] == true){
							modelCount++;
						}
					}
					if(modelCount == modelsToTarget){
						this.eventListeners[listenerName].func.call();
					}
				}
			}
		}
};