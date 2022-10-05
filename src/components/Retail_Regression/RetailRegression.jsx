import React, { useState,useRef} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import {CirclesWithBar} from  'react-loader-spinner'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from "./RetailRegression.module.css"
import 'primeicons/primeicons.css';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';



function RetailRegression() { 

    const navigate = useNavigate()
    const config = {
        headers: {
          'content-type': 'multipart/form-data',
          
        },
      };
    const toast = useRef(null)
    const msgs1 = useRef(null);  
    const token = localStorage.getItem("token") 
    let [username,setUsername] = useState("")   
    let copyright = new Date().getFullYear()  
 
   
    // Input Declaration . 

    let [AvgDrop,SetAvgDrop] = useState("")
    let [AppTime,SetAppTime] = useState("")
    let [WebTime,SetWebTime] = useState("") 
    let [Membership,SetMembership] = useState("")
    let [Preprocess,SetPreprocess] = useState("")
    let [Algorithm,SetAlgorithm] = useState("")  

    let [RegLoader,SetRegLoader] = useState(false) 
    let [RegVisible,SetRegVisible] = useState(false) 

    let minutes = []
    
    for(var i=1;i<=300;i++){
        minutes.push(i)
    }

    let scaler = ["MinMax","Robust","Standard","None"]
    let models = ["Linear","XGBooster","Lasso","Ridge","RandomForest"]
     

    // Linear Regression Output Declarations 

    
    
    let [LRTRACC,SetLRTRACC] = useState("")
    let [LRTEACC,SetLRTEACC] = useState("")
    let [LRSlope,SetLRSlope] = useState("")
    let [LRIntercept,SetLRIntercept] = useState("")
    let [LRMSE,SetLRMSE] = useState("") 
    let [LRMAE,SetLRMAE] = useState("") 
    let [LRR2,SetLRR2] = useState("") 
    let [LRImg,SetLRImg] = useState(null)  
    let [LRHist,SetLRHist] = useState(null) 
    let [LRPred,SetLRPred] = useState("")  


    // XGBooster Regression Output Declarations . 

   
    let [XGBTrainR2,SetXGBTrainR2] = useState("") 
    let [XGBTestR2,SetXGBTestR2] = useState("") 
    let [XGBTrainMAE,SetXGBTrainMAE] = useState("") 
    let [XGBTestMAE,SetXGBTestMAE] = useState("") 
    let [XGBTestMSE,SetXGBTestMSE] = useState("") 
    let [XGBImg,SetXGBImg] = useState(null) 
    let [XGBHist,SetXGBHist] = useState(null) 
    let [XGBPred,SetXGBPred] = useState("")    


   // Lasso Regression Output Declarations 

    let [LassoTrainR2,SetLassoTrainR2] = useState("") 
    let [LassoTestR2,SetLassoTestR2] = useState("") 
    let [LassoTrainMAE,SetLassoTrainMAE] = useState("") 
    let [LassoTestMAE,SetLassoTestMAE] = useState("") 
    let [LassoTestMSE,SetLassoTestMSE] = useState("") 
    let [LassoImg,SetLassoImg] = useState(null) 
    let [LassoHist,SetLassoHist] = useState(null) 
    let [LassoPred,SetLassoPred] = useState("")   



    // Ridge Regression output Declaration 

    let [RidgeTrainR2,SetRidgeTrainR2] = useState("") 
    let [RidgeTestR2,SetRidgeTestR2] = useState("") 
    let [RidgeTrainMAE,SetRidgeTrainMAE] = useState("") 
    let [RidgeTestMAE,SetRidgeTestMAE] = useState("") 
    let [RidgeTestMSE,SetRidgeTestMSE] = useState("") 
    let [RidgeImg,SetRidgeImg] = useState(null) 
    let [RidgeHist,SetRidgeHist] = useState(null) 
    let [RidgePred,SetRidgePred] = useState("")  
    

    // RF Regression Output Declaration .   
    

    let [RFTrainR2,SetRFTrainR2] = useState("") 
    let [RFTestR2,SetRFTestR2] = useState("") 
    let [RFTrainMAE,SetRFTrainMAE] = useState("") 
    let [RFTestMAE,SetRFTestMAE] = useState("") 
    let [RFTestMSE,SetRFTestMSE] = useState("") 
    let [RFImg,SetRFImg] = useState(null) 
    let [RFHist,SetRFHist] = useState(null) 
    let [RFPred,SetRFPred] = useState("")   

    // Regression Report 

    let [RegReport,SetRegReport] = useState("")



    
    








    React.useEffect(() => { 


        const  tokenAuth = ()=>{
        axios.defaults.baseURL = 'http://localhost:5000';
        axios.defaults.headers.post['Content-Type'] ='multipart/form-data'
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.common = {'Authorization': `bearer ${token}`} 
        axios.post("http://localhost:5000/Authorization",{}).then((response) => {
          console.log(response.data); 
          setUsername(response.data["username"])
          console.log(username)
          if(response.data.Code === "404"){
            toast.current.show({severity: 'error', summary: 'Authentication Error', detail: 'UnAuthorized User'});
            msgs1.current.show({severity: 'error', summary: 'Authentication Error',detail: 'UnAuthorized User'});  
  
            setInterval(()=>{
              navigate("/login");
            },100); 
  
         
          }
         
        }).catch((err)=>{
          console.log(err); 
          toast.current.show({severity: 'error', summary: 'Error while Authentication', detail: 'Error while Authentication Process'});
          msgs1.current.show({severity: 'error', summary: 'Error while Authentication',detail: 'Error while Authentication'});  
          
          navigate("/login")
         
        })
      };
      
      tokenAuth();
      },[token,navigate,username]);   
    

    // Regression Getter 

    function RegressionModelProcessor(){
        if(AvgDrop === "" || AppTime === "" || WebTime === "" || Preprocess === "" || Algorithm === ""){
            toast.current.show({severity: 'error', summary: 'error while fetching Regression Model', detail: 'Null value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching Regression Model',detail: 'Empty value found '});  
            return ;
        } 

        let RMForm = new FormData() 
        RMForm.append("avg",AvgDrop)
        RMForm.append("app",AppTime) 
        RMForm.append("web",WebTime) 
        RMForm.append("member",Membership) 
        RMForm.append("scale",Preprocess) 
        RMForm.append("model",Algorithm) 

        axios.post("http://localhost:5000/RRM",RMForm,config).then((resp)=>{ 
            toast.current.show({severity: 'info', summary: 'Regression Analysis has been Done', detail: 'Data Found'});
            msgs1.current.show({severity: 'success', summary: 'Regression Analysis',detail: 'Regression Data Fetched'}); 

            console.log(resp.data); 
            SetRegReport(resp.data)
            if(Algorithm === "Linear"){ 

                SetLRTRACC(resp.data["traindata_accuracy"]) 
                SetLRTEACC(resp.data["testdata_accuracy"])
                SetLRSlope(resp.data["slope"])
                SetLRIntercept(resp.data["intercept"]) 
                SetLRMAE(resp.data["MAE"]) 
                SetLRMSE(resp.data["MSE"])  
                SetLRR2(resp.data["r2score"]) 
                SetLRImg(resp.data["LRPredImg"]) 
                SetLRHist(resp.data["LRHist"])
                SetLRPred(resp.data["newpred"])
   
    
            }

            else if(Algorithm === "XGBooster"){ 
                
                SetXGBTrainR2(resp.data["train_r2"])
                SetXGBTestR2(resp.data["test_r2"]) 
                SetXGBTrainMAE(resp.data["train_MAE"]) 
                SetXGBTestMAE(resp.data["test_MAE"]) 
                SetXGBTestMSE(resp.data["test_MSE"]) 
                SetXGBImg(resp.data["XGB_Img"]) 
                SetXGBHist(resp.data["XGBHist"]) 
                SetXGBPred(resp.data["newpred"]) 

            }  

            else if(Algorithm === "Lasso"){
                SetLassoTrainR2(resp.data["train_r2"])
                SetLassoTestR2(resp.data["test_r2"]) 
                SetLassoTrainMAE(resp.data["train_MAE"]) 
                SetLassoTestMAE(resp.data["test_MAE"]) 
                SetLassoTestMSE(resp.data["test_MSE"]) 
                SetLassoImg(resp.data["Lasso_Img"]) 
                SetLassoHist(resp.data["LassoHist"]) 
                SetLassoPred(resp.data["newpred"]) 
            } 

            else if(Algorithm === "Ridge"){
                SetRidgeTrainR2(resp.data["train_r2"])
                SetRidgeTestR2(resp.data["test_r2"]) 
                SetRidgeTrainMAE(resp.data["train_MAE"]) 
                SetRidgeTestMAE(resp.data["test_MAE"]) 
                SetRidgeTestMSE(resp.data["test_MSE"]) 
                SetRidgeImg(resp.data["Ridge_Img"]) 
                SetRidgeHist(resp.data["Ridge_Hist"]) 
                SetRidgePred(resp.data["newpred"]) 
            } 
            else if(Algorithm === "RandomForest"){
                SetRFTrainR2(resp.data["train_r2"])
                SetRFTestR2(resp.data["test_r2"]) 
                SetRFTrainMAE(resp.data["train_MAE"]) 
                SetRFTestMAE(resp.data["test_MAE"]) 
                SetRFTestMSE(resp.data["test_MSE"]) 
                SetRFImg(resp.data["RFR_Img"]) 
                SetRFHist(resp.data["RFRHist"]) 
                SetRFPred(resp.data["newpred"]) 
            }





            SetRegLoader(false) 
            SetRegVisible(true)

            
           
            
        }).catch((err)=>{ 

            console.log(err)
            SetRegLoader(false)
            toast.current.show({severity: 'error', summary: 'error while fetching Regression Models', detail: 'No Value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching Regression Models',detail: 'No value found '});  
            return ;
        })


        SetRegLoader(true)
    }

      // Export PDF 

    function ExportPDF(){
        var print = document.getElementById('print');
        // var width = document.getElementById('print').offsetWidth;
        document.getElementById("downloadbtn").style.visibility = "hidden";
        document.getElementById("pbibtn").style.visibility = "hidden";
        document.getElementById("backtohomebtn").style.visibility = "hidden";

        html2canvas(print).then(canvas => {
          var imgWidth = 208;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png')
          let pdf = new jspdf.jsPDF('p', 'mm', 'a3');
          var position = 5;
          pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight) 
          
        //   pdf.save('Digitech_SalesForecast.pdf'); 
        pdf.save("RetailerRegressionModel.pdf")
         })

         document.getElementById("downloadbtn").style.visibility = "visible"; 
         document.getElementById("pbibtn").style.visibility = "visible"; 
         document.getElementById("backtohomebtn").style.visibility = "visible";  

      } 

      // Save Regression Report 

      function SaveRegReport(){
        if(AvgDrop === "" || AppTime === "" || WebTime === "" || Preprocess === "" || Algorithm === "" || RegReport === ""){
            toast.current.show({severity: 'error', summary: 'error while saving Regression Model', detail: 'Predict the data'});
            msgs1.current.show({severity: 'error', summary: 'error while saving Regression Model',detail: 'Empty value found '});  
            return ;
        } 

        RegReport["Avg"] = AvgDrop 
        RegReport["AppTime"] = AppTime 
        RegReport["WebTime"] = WebTime 
        RegReport["Member"] =Membership 
        RegReport["Scaler"] = Preprocess 
        RegReport["Algorithm"] = Algorithm 
        console.log(RegReport); 
        let SaveFormData = new FormData() 
        SaveFormData.append("username",username)
        SaveFormData.append("rr",JSON.stringify(RegReport))  
        axios.post("http://localhost:5000/saveRRReport",SaveFormData,config).then((resp)=>{
            console.log(resp.data); 
            toast.current.show({severity: 'info', summary: 'Regression Analysis Report has been Saved', detail: 'Regression Report Saved Successfully'});
            msgs1.current.show({severity: 'success', summary: 'Regression Report Saved',detail: 'Regression Report Saved'}); 


        }).catch((err)=>{
           console.log(err); 
           toast.current.show({severity: 'error', summary: 'error while saving Regression Model', detail: 'Unknown error'});
            msgs1.current.show({severity: 'error', summary: 'error while saving Regression Model',detail: 'Unknown Error'});  
        })
      }

  // Back to Home Navigator 

  function HomeNavigator(){
    navigate("/dashboard")
  }

 
  return (
    <div className={`${styles.retailer}`}>
        <Toast ref={toast}></Toast>
        <Messages ref={msgs1} /> 


        <div className={`${styles.retailhead} text-center card-header`}>
            <h3 className={`${styles.retailheader} card-footer`}>Digiverz Retailing Regression Model Analysis</h3>
            
            <Button label="Download PDF" className="p-button-warning" icon="pi pi-cloud-download" iconPos="right" onClick={ExportPDF} id="downloadbtn"/>
            <button className='btn btn-dark' id="pbibtn">Power BI Report</button>
            <button className='btn btn-dark' id="backtohomebtn" onClick={HomeNavigator}>Back to Home</button>
        </div>  

        <div id='print'>
            <Toast ref={toast}></Toast>
            <Messages ref={msgs1} /> 
            <h4 className={`text-center card-footer ${styles.retaildescheader}`}>Predict your Customer Sales Below.</h4>   

            <div className={`${styles.wcss} card-header`}>
                <h5 className={`${styles.wcssheader} text-center card-header`}>Process Below the Customer Behavioural Data.</h5>
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} />   

                <Dropdown value={AvgDrop} options={minutes} onChange={(e) => SetAvgDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Average Session Length"/> 
                <Dropdown value={AppTime} options={minutes} onChange={(e) => SetAppTime(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Spending Time in App"/>  
                <Dropdown value={WebTime} options={minutes} onChange={(e) => SetWebTime(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Spending Time in Website"/>  
                <Dropdown value={Membership} options={minutes} onChange={(e) => SetMembership(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Membership Length"/>  
                <Dropdown value={Preprocess} options={scaler} onChange={(e) => SetPreprocess(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Scaling Processor"/>  
                <Dropdown value={Algorithm} options={models} onChange={(e) => SetAlgorithm(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Model"/> 

                <Button label="Predict" icon="pi pi-slack" iconPos="right"  onClick={RegressionModelProcessor} className={`${styles.retailzoomcal} `} /> 
                <Button label="Save Report" icon="pi pi-cloud-upload" iconPos="right"  onClick={SaveRegReport} className={`${styles.retailzoomcal} p-button-danger`} /> 

                
            </div>  

            <div className='card card-header'>
               <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={RegLoader} outerCircleColor=""/> 
               {
                 RegVisible === true ? 
                 <div>
                    {
                        Algorithm === "Linear" ? 
                        <div className={`${styles.algodiv}`}> 
                            
                           <img src={`data:image/png;base64,${LRImg}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                           <img src={`data:image/png;base64,${LRHist}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                           <h2 className={`text-center bg-warning`}>Linear Regression Model Summary</h2>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Accuracy : "+LRTRACC}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Accuracy :  "+LRTEACC}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Slope :  "+LRSlope}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Intercept :  "+LRIntercept}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Mean Absolute Error :  "+LRMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Mean Square Error : "+LRMSE}</h3>  
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Prediction Efficiency : "+LRR2}</h3>  
                           
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Value : "+LRPred}</h3>
                
                        </div> : null
                    } 

                    {
                        Algorithm === "XGBooster" ? 
                        <div className={`${styles.algodiv}`}> 
                            
                           <img src={`data:image/png;base64,${XGBImg}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                           <img src={`data:image/png;base64,${XGBHist}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                           <h2 className={`text-center bg-warning`}>XG Booster Regression Model Summary</h2>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Efficiency(R2 Score): "+XGBTrainR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Efficiency(R2 Score) :  "+XGBTestR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Train Data Mean Absolute Error :  "+XGBTrainMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Absolute Error :  "+XGBTestMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Square Error :  "+XGBTestMSE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Value : "+XGBPred}</h3>
                
                        </div> : null
                    } 
                    
                    {
                        Algorithm === "Lasso" ? 
                        <div className={`${styles.algodiv}`}> 
                            
                           <img src={`data:image/png;base64,${LassoImg}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                           <img src={`data:image/png;base64,${LassoHist}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                           <h2 className={`text-center bg-warning`}>Lasso Regression Model Summary</h2>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Efficiency(R2 Score): "+LassoTrainR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Efficiency(R2 Score) :  "+LassoTestR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Train Data Mean Absolute Error :  "+LassoTrainMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Absolute Error :  "+LassoTestMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Square Error :  "+LassoTestMSE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Value : "+LassoPred}</h3>
                
                        </div> : null
                    }  

                    {
                        Algorithm === "Ridge" ? 
                        <div className={`${styles.algodiv}`}> 
                            
                           <img src={`data:image/png;base64,${RidgeImg}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                           <img src={`data:image/png;base64,${RidgeHist}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                           <h2 className={`text-center bg-warning`}>Ridge Regression Model Summary</h2>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Efficiency(R2 Score): "+RidgeTrainR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Efficiency(R2 Score) :  "+RidgeTestR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Train Data Mean Absolute Error :  "+RidgeTrainMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Absolute Error :  "+RidgeTestMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Square Error :  "+RidgeTestMSE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Value : "+RidgePred}</h3>
                
                        </div> : null
                    } 

                    {
                        Algorithm === "RandomForest" ? 
                        <div className={`${styles.algodiv}`}> 
                            
                           <img src={`data:image/png;base64,${RFImg}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                           <img src={`data:image/png;base64,${RFHist}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                           <h2 className={`text-center bg-warning`}>Ridge Regression Model Summary</h2>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Efficiency(R2 Score): "+RFTrainR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Efficiency(R2 Score) :  "+RFTestR2}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Train Data Mean Absolute Error :  "+RFTrainMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Absolute Error :  "+RFTestMAE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Square Error :  "+RFTestMSE}</h3>
                           <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Value : "+RFPred}</h3>
                
                        </div> : null
                    } 

                 </div> : null 
               }
            </div> 

            <div>
                <h3 className={`${styles.copyright} text-center card-footer`}>Digiverz KAAR Techologies Pvt Limited CopyRight @ {" " +copyright}</h3>
            </div>

        </div>
        
       
    </div>
  )
}

export default RetailRegression