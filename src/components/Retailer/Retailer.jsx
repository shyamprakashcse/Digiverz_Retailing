import React, { useState,useRef} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import {CirclesWithBar} from  'react-loader-spinner'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from "./Retailer.module.css"
import 'primeicons/primeicons.css';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';



function Retailer() { 

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

    // Description Initialization . 

    let [HeatMap,SetHeatMap] = useState(null)
    let [PairPlot,SetPairPlot] = useState(null) 
    let [DistPlot,SetDistPlot] = useState(null)
    let [DistDrop,SetDistDrop] = useState("") 
    let [DistLoader,SetDistLoader] = useState(false)
    let [DistVisible,SetDistVisible] = useState(false)

    let [BoxPlot,SetBoxPlot] = useState(null)
    let [BoxDrop,SetBoxDrop] = useState("")
    let [BoxLoader,SetBoxLoader] = useState(false)
    let [BoxVisible,SetBoxVisible] = useState(false)  


    let [SkewPlot,SetSkewPlot] = useState(null)
    let [SkewDrop,SetSkewDrop] = useState("")
    let [SkewLoader,SetSkewLoader] = useState(false)
    let [SkewVisible,SetSkewVisible] = useState(false)   

    let [SkewMean,SetSkewMean] = useState("")
    let [SkewSD,SetSkewSD] = useState("")

    



    let feature_names = ['Avg. Session Length', 'Time on App', 'Time on Website','Length of Membership']
 
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



      React.useEffect(()=>{
        
        // Getting Sales Graphs 
    
        axios.get("http://localhost:5000/getretaildescription").then((resp)=>{
            console.log(resp.data); 
            SetPairPlot(resp.data["pairplot"])
            SetHeatMap(resp.data["heatmap"])
            
        }).catch((err)=>{
            console.log(err); 
              toast.current.show({severity: 'error', summary: 'Error while Getting Retailing Description', detail: 'Error while Performing Retail Analysis'});
              msgs1.current.show({severity: 'error', summary: 'Error while Getting Retailing Description',detail: 'Error while Getting Retail Analysis'});  
              
        })
        
          },[]) 


    function getDistPlot(){

        if(DistDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting Distplot', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting Distplot',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let DistFormData = new FormData()
        DistFormData.append("col",DistDrop)
        SetDistLoader(true) 

        axios.post("http://localhost:5000/getRetailDistPlot",DistFormData,config).then((resp)=>{ 
                
                SetDistPlot(resp.data)
                SetDistLoader(false)
                SetDistVisible(true)
                toast.current.show({severity: 'info', summary: 'Distplot Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Distributive Analysis',detail: 'Distplot Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetDistLoader(false)
                SetDistVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching Distplot', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching Distplot',detail: 'Distplot Error '}); 

            })
              
            
      

    }


    function getBoxPlot(){ 


        if(BoxDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting Boxplot', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting Boxplot',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let BoxFormData = new FormData()
        BoxFormData.append("col",BoxDrop)
        SetBoxLoader(true) 

        axios.post("http://localhost:5000/getRetailBoxPlot",BoxFormData,config).then((resp)=>{ 
                
                SetBoxPlot(resp.data)
                SetBoxLoader(false)
                SetBoxVisible(true)
                toast.current.show({severity: 'info', summary: 'Distplot Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Distributive Analysis',detail: 'Boxplot Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetBoxLoader(false)
                SetBoxVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching Boxplot', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching Boxplot',detail: 'Boxplot Error '}); 

            })

    }
    

    function getSkewPlot(){ 


        if(SkewDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting Skewplot', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting Skewplot',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let SkewFormData = new FormData()
        SkewFormData.append("col",SkewDrop)
        SetSkewLoader(true) 

        axios.post("http://localhost:5000/getRetailSkewPlot",SkewFormData,config).then((resp)=>{ 
                
                SetSkewPlot(resp.data["skewgraph"])
                SetSkewMean(resp.data["mean"])
                SetSkewSD(resp.data["sd"])
                SetSkewLoader(false)
                SetSkewVisible(true)
                toast.current.show({severity: 'info', summary: 'Skew plot Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Distributive Analysis',detail: 'Skewplot Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetSkewLoader(false)
                SetSkewVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching Skewplot', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching Skewplot',detail: 'Skew plot Error '}); 

            })

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
          let pdf = new jspdf.jsPDF('p', 'mm', 'a0');
          var position = 5;
          pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight) 
          
        //   pdf.save('Digitech_SalesForecast.pdf'); 
        pdf.save("Retailer.pdf")
         })

         document.getElementById("downloadbtn").style.visibility = "visible"; 
         document.getElementById("pbibtn").style.visibility = "visible"; 
         document.getElementById("backtohomebtn").style.visibility = "visible";  

      } 


  return ( 
        <div className={`${styles.retailer}`} id="print"> 
            <Toast ref={toast}></Toast>
            <Messages ref={msgs1} /> 


            <div className={`${styles.retailhead} text-center card-header`}>
                <h3 className={`${styles.retailheader} card-footer`}>Digiverz Retailing Analysis and Segmentation</h3>
                <button className='btn btn-warning' id="downloadbtn" onClick={ExportPDF}>Download PDF</button>
                <button className='btn btn-dark' id="pbibtn">Power BI Report</button>
                <button className='btn btn-dark' id="backtohomebtn">Back to Home</button>
            </div>  

            <div className={`${styles.retaildesc} card card-header`}> 
                <h3 className={`text-center card-footer ${styles.retaildescheader}`}>Pair Plot Analysis</h3>
                <img src={`data:image/jpeg;base64,${PairPlot}`}alt='pairplot' className={``}></img>
                <h3 className={`text-center card-footer ${styles.retaildescheader}`}>Correlation Heat Map</h3>
                <img src={`data:image/png;base64,${HeatMap}`}alt='heat map' className={`${styles.heatmap}`}></img> 
                <h3 className={`${styles.result} text-center card-footer`}>Result : The Target Features has highly Positively Correlated with Time on App and Membership Length Features</h3>
                <h3 className={`${styles.result} text-center card-footer`}>The Target Features has negatively Correlated with Time Spend on Website</h3>
            </div> 

            <div> 
                <h3 className={`text-center card-footer ${styles.retaildescheader}`}>Distribution Analysis</h3> 
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={DistDrop} options={feature_names} onChange={(e) => SetDistDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={getDistPlot} className={`${styles.retailzoomcal}`} />

            </div> 

            <div  className='card-header'>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={DistLoader} outerCircleColor=""/> 
                {
                   DistVisible === true ?  <img src={`data:image/png;base64,${DistPlot}`} alt='Dist Plot' className={`${styles.distplt}`}></img> : null  
                }
            
            </div>

            <div> 
                <h3 className={`text-center card-footer ${styles.retaildescheader}`}>Box Plot Analysis</h3> 
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={BoxDrop} options={feature_names} onChange={(e) => SetBoxDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={getBoxPlot} className={`${styles.retailzoomcal}`} />

            </div> 

            <div  className='card-header'>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={BoxLoader} outerCircleColor=""/> 
                {
                   BoxVisible === true ?  <img src={`data:image/png;base64,${BoxPlot}`} alt='Box Plot' className={`${styles.distplt}`}></img> : null  
                }
            
            </div>  


            <div> 
                <h3 className={`text-center card-footer ${styles.retaildescheader}`}>Skewness Analysis</h3> 
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={SkewDrop} options={feature_names} onChange={(e) => SetSkewDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={getSkewPlot} className={`${styles.retailzoomcal}`} />

            </div> 

            <div>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={SkewLoader} outerCircleColor=""/> 
                {
                   SkewVisible === true ?  
                   <div className='card-header'>
                        <img src={`data:image/png;base64,${SkewPlot}`} alt='Box Plot' className={`${styles.distplt}`}></img> 
                        <h3 className={`${styles.summary} card-header text-center`}>{"The Skewness Mean Value is "+SkewMean}</h3>
                        <h3 className={`${styles.summary} card-header text-center`}>{"The Skewness Standard Deviation Value is "+SkewSD}</h3>
                   </div> : null  
                }
            
            </div>  
             

            <div>
             <h3 className={`${styles.copyright} text-center card-footer`}>Digiverz KAAR Techologies Pvt Limited CopyRight @ {" " +copyright}</h3>
            </div>

            
        </div>
  )
}

export default Retailer