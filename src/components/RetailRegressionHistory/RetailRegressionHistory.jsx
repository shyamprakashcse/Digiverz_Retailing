import React, { useState,useRef} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import styles from "./RetailRegressionHistory.module.css"
import 'primeicons/primeicons.css';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

function RetailRegressionHistory() { 

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

    let history = [] 

    let [SRHistory,SetSRHistory] = useState("")
    let [ReportVisible,SetReportVisible] = useState(false) 
    let [LRVisible,SetLRvisible] = useState(false)
    let [SelectedReport,SetSelectedReport] = useState("")
    

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
          else{
              let RegReportForm = new FormData() 
              RegReportForm.append("username",username) 
              axios.post("http://localhost:5000/getRRReport",RegReportForm,config).then((resp)=>{ 
                
                console.log(resp.data)
                
                let temprrhistory = resp.data
                let d = {}
                let report = {}
                history = [] 
                temprrhistory.forEach(element => {
                    d = {}
                    d["uniqueid"] = element["uniqueid"]
                    d["processedon"] = element["processedon"]
                    report = JSON.parse(element["report"]) 
                    d["Algorithm"] = report["Algorithm"]
                    d["Scaler"] = report["Scaler"]
                    d["Avg"] = report["Avg"]
                    d["AppTime"] = report["AppTime"]
                    d["WebTime"] = report["WebTime"] 
                    d["Member"] = report["Member"] 
                    d["report"] = report 
                    
                    if(report["Algorithm"] === "Linear"){ 

                    d["train_acc"] = report["train_accuracy"] 
                    d["test_acc"] =   report["test_accuracy"]
                    d["slope"]  =   report["slope"]
                    d["intercept"] =    report["intercept"] 
                    d["test_MAE"]=    report["MAE"] 
                    d["test_MSE"]=    report["MSE"]  
                    d["test_r2"]= report["r2score"] 
                    d["predimg"] = report["LRPredImg"] 
                    d["predhist"] =    report["LRHist"]
                    d["pred"] =  report["newpred"]
           
            
                    }
                    else if(report["Algorithm"]==="XGBooster") {
                         d["train_r2"]  = report["train_r2"]
                         d["test_r2"]   = report["test_r2"]
                         d["train_MAE"] = report["train_MAE"]
                         d["test_MAE"]  = report["test_MAE"]
                         d["test_MSE"]  = report["test_MSE"]
                         d["predimg"]   = report["XGB_Img"]
                         d["predhist"]  = report["XGBHist"]
                         d["pred"]      = report["newpred"]

                    }

                    else if(report["Algorithm"]==="Lasso") {
                        d["train_r2"]  = report["train_r2"]
                        d["test_r2"]   = report["test_r2"]
                        d["train_MAE"] = report["train_MAE"]
                        d["test_MAE"]  = report["test_MAE"]
                        d["test_MSE"]  = report["test_MSE"]
                        d["predimg"]   = report["Lasso_Img"]
                        d["predhist"]  = report["LassoHist"]
                        d["pred"]      = report["newpred"]

                   }

                   else if(report["Algorithm"] === "Ridge"){
                        d["train_r2"]  = report["train_r2"]
                        d["test_r2"]   = report["test_r2"]
                        d["train_MAE"] = report["train_MAE"]
                        d["test_MAE"]  = report["test_MAE"]
                        d["test_MSE"]  = report["test_MSE"]
                        d["predimg"]   = report["Ridge_Img"]
                        d["predhist"]  = report["Ridge_Hist"]
                        d["pred"]      = report["newpred"]
                } 
                else if(report["Algorithm"] === "RandomForest"){
                        d["train_r2"]  = report["train_r2"]
                        d["test_r2"]   = report["test_r2"]
                        d["train_MAE"] = report["train_MAE"]
                        d["test_MAE"]  = report["test_MAE"]
                        d["test_MSE"]  = report["test_MSE"]
                        d["predimg"]   = report["RFR_Img"]
                        d["predhist"]  = report["RFRHist"]
                        d["pred"]      = report["newpred"]
                }

                   
                    
                    history.push(d)
                    SetSRHistory(history) 
                    

                }); 
                
                
                toast.current.show({severity: 'info', summary: 'Reports Found', detail: 'Regression Reports Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Regression Report Data Data Found',detail: 'Report fetched successfully'}); 


              }).catch((err)=>{
                console.log(err)
              }) 
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

     // Export PDF 

     function ExportPDF(){
        var print = document.getElementById('print');
        // var width = document.getElementById('print').offsetWidth;
        document.getElementById("downloadbtn").style.visibility = "hidden";

        html2canvas(print).then(canvas => {
          var imgWidth = 208;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png') ;
          let pdf;
          
          if(SelectedReport["Algorithm"]==="Linear"){
            pdf = new jspdf.jsPDF('p', 'mm', 'a2');
          }
          else{
             pdf = new jspdf.jsPDF('p', 'mm', 'a3');
          }
          
          var position = 5;
          pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight) 
          
        //   pdf.save('Digitech_SalesForecast.pdf'); 
        pdf.save(SelectedReport["uniqueid"]+"_"+SelectedReport["Algorithm"]+".pdf")
         })

         document.getElementById("downloadbtn").style.visibility = "visible"; 

      }  

      // Report Displayer 

      function ReportDisplayer(item){
         if(item["Algorithm"] === "Linear"){
            SetLRvisible(true); 
         }
         else{
            SetLRvisible(false)
         }
         console.log(item)
         SetSelectedReport(item)
         SetReportVisible(true)
      }

  // Home Navigation 

  function HomeNavigator(){
    navigate("/dashboard")
  }

 
  return (
    <div className={`${styles.reghist}`}>
        <Toast ref={toast}></Toast>
        <Messages ref={msgs1} /> 
        <div className={`${styles.sfrepdiv} card-header`}>
            <h3 className={`${styles.reghisthead} text-center card-header  `}>Past Retail Regression based Predictions History Results.</h3> 
            <button className='btn btn-dark m-2' onClick={HomeNavigator}>Back to Home</button>
        </div> 

        <div>
            <table className={`table table-bordered table-striped  table-hover table-responsive ${styles.rrtab}`}>
                <thead className={`bg-warning ${styles.tabhead}  text-capitalize border-solid text-md-center border-dark`}>
                    <tr>
                        <th className={``}>Serial No</th> 
                        <th className={``}>Processed ID</th>
                        <th className={``}>Processed On</th> 
                        <th className={``}>Scaling</th>
                        <th className={``}>Algorithm</th> 
                        <th className={``}>Average Session Time</th> 
                        <th className={``}>App Spending Time</th>
                        <th className={``}>Website Spending Time</th> 
                        <th className={``}>Membership Length</th> 
                      
                        
                        
                    </tr>
                </thead> 
                <tbody className={`border-solid border-dark fw-bold`}>
                   { SRHistory.length>0 ?
                     SRHistory.map((item,ind)=>{
                        return(
                            <tr className={`bg-light card-header`} key={ind} onClick={()=>{ReportDisplayer(SRHistory[ind])}}>
                              <td className={`${styles.tabrow} `}>{ind+1}</td>
                              <td className={`${styles.tabrow}`}>{item["uniqueid"]}</td>
                              <td className={`${styles.tabrow}`}>{item["processedon"].slice(0,2)+"/"+item["processedon"].slice(2,4)+"/"+item["processedon"].slice(4,8)+" "+item["processedon"].slice(8,10)+":"+item["processedon"].slice(10,12)+":" + item["processedon"].slice(12,14)}</td>
                              <td className={`${styles.tabrow}`}>{item["Scaler"]}</td>
                              <td className={`${styles.tabrow}`}>{item["Algorithm"]}</td>
                              <td className={`${styles.tabrow}`}>{item["Avg"]}</td>
                              <td className={`${styles.tabrow}`}>{item["AppTime"]}</td>
                              <td className={`${styles.tabrow}`}>{item["WebTime"]}</td>
                              <td className={`${styles.tabrow}`}>{item["Member"]}</td>
                            </tr>
                           )
                     }) :null
                   }

                   {
                     SRHistory.length === 0 ? <h6 className='card-header bg-danger m-4'>No Past History Found.To show here Save your results After forcasting</h6> : null 
                   }
                </tbody>
            </table>

        </div> 

        {
            ReportVisible === true ? 
            <div id="print">
            {
                LRVisible === true ? 
                
                <div>  
                        <div className={`${styles.rephead}`}> 
                            <button className={`${styles.repheadbtn} btn btn-dark`} id="downloadbtn" onClick={ExportPDF}>Download Report</button>
                            <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Report ID : "+SelectedReport["uniqueid"]}</h3>
                            <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Report Saved on : "+SelectedReport["processedon"].slice(0,2)+"/"+SelectedReport["processedon"].slice(2,4)+"/"+SelectedReport["processedon"].slice(4,8)+" "+SelectedReport["processedon"].slice(8,10)+":"+SelectedReport["processedon"].slice(10,12)+":" + SelectedReport["processedon"].slice(12,14)}</h3>
               
                        </div>
                        <img src={`data:image/png;base64,${SelectedReport["predimg"]}`} alt='LRImage' className={`${styles.silhouteeimg}`}></img> 
                        <img src={`data:image/png;base64,${SelectedReport["predhist"]}`} alt='LRHist' className={`${styles.silhouteeimg}`}></img>  
                        <h2 className={`text-center bg-warning`}>Linear Regression Model Summary</h2>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Accuracy : "+SelectedReport["report"]["traindata_accuracy"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Accuracy :  "+SelectedReport["report"]["testdata_accuracy"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Slope :  "+SelectedReport["slope"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Intercept :  "+SelectedReport["intercept"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Mean Absolute Error :  "+SelectedReport["report"]["MAE"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Mean Square Error : "+SelectedReport["report"]["MSE"]}</h3>  
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Prediction Efficiency : "+SelectedReport["report"]["r2score"]}</h3>  
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Processed Scaler Algorithm : "+SelectedReport["Scaler"]}</h3>
                        <h2 className={`${styles.retaildescheader} text-center card-header bg-primary`}> Input Data Processed Summary</h2> 
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Average Session Length in Minutes : "+SelectedReport["Avg"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Spending Time in App in Minutes : "+SelectedReport["AppTime"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Spending Time in Website in minutes : "+SelectedReport["WebTime"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Membership Length in Year : "+SelectedReport["Member"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Amount of this customer : "+SelectedReport["pred"]}</h3>
                        <div>
                          <h3 className={`${styles.copyright} text-center card-footer`}>Digiverz KAAR Techologies Pvt Limited CopyRight @ {" " +copyright}</h3>
                      </div>
                </div> : null 
            }  

            {
              LRVisible === false ? 
               <div>
                    <div className={`${styles.rephead}`}>
                         <button className={`${styles.repheadbtn} btn btn-dark`} id="downloadbtn" onClick={ExportPDF}>Download Report</button>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Report ID : "+SelectedReport["uniqueid"]}</h3>
                        <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Report Saved on : "+SelectedReport["processedon"].slice(0,2)+"/"+SelectedReport["processedon"].slice(2,4)+"/"+SelectedReport["processedon"].slice(4,8)+" "+SelectedReport["processedon"].slice(8,10)+":"+SelectedReport["processedon"].slice(10,12)+":" + SelectedReport["processedon"].slice(12,14)}</h3>
                       
                    </div>
                    <img src={`data:image/png;base64,${SelectedReport["predimg"]}`} alt='iage' className={`${styles.silhouteeimg}`}></img> 
                    <img src={`data:image/png;base64,${SelectedReport["predhist"]}`} alt='Hist' className={`${styles.silhouteeimg}`}></img>  
                    <h2 className={`text-center bg-warning`}>{SelectedReport["Algorithm"] +"Regression Model Summary"}</h2>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Training Data Efficiency(R2 Score): "+SelectedReport["train_r2"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Efficiency(R2 Score) :  "+SelectedReport["test_r2"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Train Data Mean Absolute Error :  "+SelectedReport["train_MAE"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Absolute Error :  "+SelectedReport["test_MAE"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Test Data Mean Square Error :  "+SelectedReport["test_MSE"]}</h3>
                    

                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Processed Scaler Algorithm : "+SelectedReport["Scaler"]}</h3>
                    <h2 className={`${styles.retaildescheader} text-center card-header bg-warning`}> Input Data Processed Summary</h2> 
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Average Session Length in Minutes : "+SelectedReport["Avg"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Spending Time in App in Minutes : "+SelectedReport["AppTime"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Spending Time in Website in minutes : "+SelectedReport["WebTime"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Membership Length in Year : "+SelectedReport["Member"]}</h3>
                    <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Predicted Sales Amount of this customer : "+SelectedReport["pred"]}</h3>
 
                    <div>
                      <h3 className={`${styles.copyright} text-center card-footer`}>Digiverz KAAR Techologies Pvt Limited CopyRight @ {" " +copyright}</h3>
                    </div>
               </div> : null 

            }
            </div> : null
        }
       
    </div>
  )
}

export default RetailRegressionHistory