import React, { useState,useRef} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { Toast } from 'primereact/toast'; 
import { Messages } from 'primereact/messages';
import {CirclesWithBar} from  'react-loader-spinner'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styles from "./RetailSegmentation.module.css"
import 'primeicons/primeicons.css';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


function RetailSegmentation() { 


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
 
    let feature_names = ['Avg. Session Length', 'Time on App', 'Time on Website','Length of Membership']

    // Kmeans Initialization 

    let [WCSS,SetWCSS] = useState(null)
    let [WCSSDrop,SetWCSSDrop] = useState("")
    let [WCSSLoader,SetWCSSLoader] = useState(false)
    let [WCSSVisible,SetWCSSVisible] = useState(false) 

    // Kmeans 

    let [KMEANS,SetKMEANS] = useState(null)
    let [KMEANSDrop,SetKMEANSDrop] = useState("")
    let [KMEANSLoader,SetKMEANSLoader] = useState(false)
    let [KMEANSVisible,SetKMEANSVisible] = useState(false) 
    let [KMEANSScore,SetKMEANSScore] = useState([])
    let [KMEANSClusterDrop,SetKMEANSClusterDrop] = useState("")
    let clustersize = []

    for(var i=2;i<=20;i++){
        clustersize.push(i)
    }
    
    // K Distance Graph , Knee Locator 

    let [KD,SetKD] = useState(null)
    let [KL,SetKL] = useState(null)
    let [OptEps,SetOptEps] = useState("")
    let [KDLDrop,SetKDLDrop] = useState("")
    let [KDLLoader,SetKDLLoader] = useState(false)
    let [KDLVisible,SetKDLVisible] = useState(false) 

    // HyperParameter Analyser 

    let [Hyper3D,SetHyper3D] = useState(null)
    let [Eps2D,SetEps2D] = useState(null)
    let [Mps2D,SetMps2D] = useState(null)
    let [HyperDrop,SetHyperDrop] = useState("")
    let [HyperLoader,SetHyperLoader] = useState(false)
    let [HyperVisible,SetHyperVisible] = useState(false)
    
    // DBSCAN Analyser 

    let [DBEPS,SetDBEPS] = useState("")
    let [DBMPS,SetDBMPS] = useState("")
    let [DBSRC,SetDBSRC] = useState("")

    let [DBSCAN,SetDBSCAN] = useState(null)
    let [Cluster,SetCluster] = useState("")
    let [VScore,SetVScore] = useState("")
    let [Noise,SetNoise] = useState("")


    let [DBLoader,SetDBLoader] = useState(false)
    let [DBVisible,SetDBVisible] = useState(false) 

    let epsilonarr = [] 
    let minptsarr  = [] 
    
    for(i=1;i<=20;i++){
        epsilonarr.push(i)
        minptsarr.push(i) 
    }
    
    // GMM (Gaussian Mixture Model)

    let [GMMDrop,SetGMMDrop] = useState("")
    let [GMMCluster,SetGMMCluster] = useState("")

    let [GMM,SetGMM] = useState(null)
    let [GMMLog,SetGMMLog] = useState("")
    let [GMMIter,SetGMMIter] = useState("")
    let [GMMLoader,SetGMMLoader] = useState(false)
    let [GMMVisible,SetGMMVisible] = useState(false)








    
 
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

      // Navigate to Home 

      function HomeNavigator(){
        navigate("/dashboard")
      }


      // K Means 
      // WCSS 

    function getWCSS(){
        if(WCSSDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting Elbow Graph', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting Elbow Graph',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let WCSSFormData = new FormData()
        WCSSFormData.append("col",WCSSDrop)
        SetWCSSLoader(true) 

        axios.post("http://localhost:5000/getWCSS",WCSSFormData,config).then((resp)=>{ 
                
                SetWCSS(resp.data)
                SetWCSSLoader(false)
                SetWCSSVisible(true)
                toast.current.show({severity: 'info', summary: 'Elbow Graph Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Segmentation Analysis',detail: 'Elbow graph Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetWCSSLoader(false)
                SetWCSSVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching Elbow Graph', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching Elbow Graph',detail: 'Elbow Graph Error '}); 

            })
              
    }
    
    // get KMeans 
    function getKmeans(){ 

        if(KMEANSDrop === "" || KMEANSClusterDrop === ""){
            toast.current.show({severity: 'error', summary: 'error while fetching K Means', detail: 'Null value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching K Means',detail: 'Empty value found '});  
            return ;

        } 

        let KMEANSForm = new FormData()
        KMEANSForm.append("col",KMEANSDrop)
        KMEANSForm.append("cluster_size",KMEANSClusterDrop) 
        SetKMEANSLoader(true)

        axios.post("http://localhost:5000/getKmeans",KMEANSForm,config).then((resp)=>{
            SetKMEANSLoader(false)
            SetKMEANSVisible(true)
            SetKMEANS(resp.data["kmeans"])
            SetKMEANSScore(resp.data["model_score"])
            console.log(resp.data["model_score"])
        }).catch((err)=>{
            SetKMEANSLoader(false)
            console.log(err)
            toast.current.show({severity: 'error', summary: 'error while fetching K Means', detail: 'No Value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching K Means',detail: 'No value found '});  
            return ;
        })

    } 


    // KDL Graphs (K distance Neighbours) (Knee Locators)
    
    function KDLGraph(){ 


        if(KDLDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting KDL Graph', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting KDL Graph',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let KDLFormData = new FormData()
        KDLFormData.append("col",KDLDrop)
        SetKDLLoader(true) 

        axios.post("http://localhost:5000/getKDLGraph",KDLFormData,config).then((resp)=>{ 
                
                SetKD(resp.data["KDGraph"])
                SetKL(resp.data["KLGraph"])
                SetOptEps(resp.data["optepsilon"])
                SetKDLLoader(false)
                SetKDLVisible(true)
                
                toast.current.show({severity: 'info', summary: 'KDL Graph Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Segmentation Analysis',detail: 'KDL graph Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetKDLLoader(false)
                SetKDLVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching KDL Graph', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching KDL Graph',detail: 'KDL Error '}); 

            })
              
    } 

    // Hyper Parameter Analysis 
    
    function HyperAnalyser(){
        
        if(HyperDrop === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting Hyper Graph', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting Hyper Graph',detail: 'Empty Values Found'}); 
            return ;  
              
        } 

        let HyperFormData = new FormData()
        HyperFormData.append("col",HyperDrop)
        SetHyperLoader(true) 

        axios.post("http://localhost:5000/getHyperGraph",HyperFormData,config).then((resp)=>{ 
                
                SetHyper3D(resp.data["3D"])
                SetEps2D(resp.data["EPS2D"])
                SetMps2D(resp.data["MPTS2D"])
                SetHyperLoader(false)
                SetHyperVisible(true)
                
                toast.current.show({severity: 'info', summary: 'Hyper Graph Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Segmentation Analysis',detail: 'Hyper graph Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetHyperLoader(false)
                SetHyperVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching Hyper Graph', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching Hyper Graph',detail: 'Hyper Error '}); 

            })
    }
    

    function DBSCANModel(){
       
        if(DBEPS === "" || DBMPS === "" || DBSRC === ""){
            toast.current.show({severity: 'error', summary: 'Error while Getting DBSCAN Graph', detail: 'Empty Values Found'});
            msgs1.current.show({severity: 'error', summary: 'Error while Getting DBSCAN Graph',detail: 'Empty Values Found'}); 
            return ;  
        } 

        let DBFormData = new FormData()
        DBFormData.append("col",DBSRC)
        DBFormData.append("eps",DBEPS)
        DBFormData.append("mps",DBMPS)  

        SetDBLoader(true)


        axios.post("http://localhost:5000/getDBSCAN",DBFormData,config).then((resp)=>{ 
                SetDBSCAN(resp.data["DBSCAN"])
                SetCluster(resp.data["N_clus"])
                SetVScore(resp.data["v_score"])
                SetNoise(resp.data["N_Noise"])

                SetDBLoader(false)
                SetDBVisible(true)
                
                
                toast.current.show({severity: 'info', summary: 'DBSCAN Graph Found', detail: 'Data Found'});
                msgs1.current.show({severity: 'success', summary: 'Segmentation Analysis',detail: 'DBSCAN graph Data Fetched'}); 

            }).catch((err)=>{
                
                console.log(err)
                SetDBLoader(false)
                SetDBVisible(false)
                toast.current.show({severity: 'error', summary: 'error while fetching DBSCAN Graph', detail: 'Data Not Found'});
                msgs1.current.show({severity: 'error', summary: 'error while fetching DBSCAN Graph',detail: 'Scan Error '}); 

            })

    }
    
    // Gaussian Mixture Model 

    function GaussianModel(){
       
        if(GMMDrop === "" || GMMCluster === ""){
            toast.current.show({severity: 'error', summary: 'error while fetching Gaussian Model', detail: 'Null value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching Gaussian Model',detail: 'Empty value found '});  
            return ;

        } 

        let GMMForm = new FormData()
        GMMForm.append("col",GMMDrop)
        GMMForm.append("cluster_size",GMMCluster) 
        SetGMMLoader(true)

        axios.post("http://localhost:5000/getGMM",GMMForm,config).then((resp)=>{ 
            console.log(resp.data)
            
            SetGMM(resp.data["GMM"])
            SetGMMLog(resp.data["c_logval"])
            SetGMMIter(resp.data["max_iter"]) 

            SetGMMLoader(false)
            SetGMMVisible(true) 
            
        }).catch((err)=>{ 

            SetGMMLoader(false)
            console.log(err)
            toast.current.show({severity: 'error', summary: 'error while fetching Gaussian', detail: 'No Value Found'});
            msgs1.current.show({severity: 'error', summary: 'error while fetching Gaussian',detail: 'No value found '});  
            return ;
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
        pdf.save("RetailerModel.pdf")
         })

         document.getElementById("downloadbtn").style.visibility = "visible"; 
         document.getElementById("pbibtn").style.visibility = "visible"; 
         document.getElementById("backtohomebtn").style.visibility = "visible";  

      } 


  return (
    <div id="print" className={`${styles.retailer}`}>
       <Toast ref={toast}></Toast>
       <Messages ref={msgs1} /> 


        <div className={`${styles.retailhead} text-center card-header`}>
            <h3 className={`${styles.retailheader} card-footer`}>Digiverz Retailing Segmentation Model Analysis</h3>
            <button className='btn btn-warning' id="downloadbtn" onClick={ExportPDF}>Download PDF</button>
            <button className='btn btn-dark' id="pbibtn">Power BI Report</button>
            <button className='btn btn-dark' id="backtohomebtn" onClick={HomeNavigator}>Back to Home</button>
        </div>   

         
        <div className={`${styles.algodiv}`}> 
            <Toast ref={toast}></Toast>
            <Messages ref={msgs1} /> 
            <h5 className={`text-center card-footer ${styles.retaildescheader}`}>K Means Clustering</h5>   

            <div className={`${styles.wcss} card-header`}>
               <h6 className={`${styles.wcssheader} text-center card-header`}>WCSS(Within Cluster Sum of Squares) Elbow Method.</h6>
               <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={WCSSDrop} options={feature_names} onChange={(e) => SetWCSSDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={getWCSS} className={`${styles.retailzoomcal}`} />

            </div> 

            <div className='card card-header'>
               <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={WCSSLoader} outerCircleColor=""/> 
              {
                  WCSSVisible === true ?  <img src={`data:image/png;base64,${WCSS}`} alt='Dist Plot' className={`${styles.wcssimg}`}></img> : null  
              }
            </div> 

            <div className={`${styles.wcss} card-header`}>
               <h6 className={`${styles.wcssheader} text-center card-header`}>Segment Your Customer Below Using Kmeans. Tune your model below.</h6>
               <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={KMEANSDrop} options={feature_names} onChange={(e) => SetKMEANSDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Dropdown value={KMEANSClusterDrop} options={clustersize} onChange={(e) => SetKMEANSClusterDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Cluster Size"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={getKmeans} className={`${styles.retailzoomcal}`} />

            </div> 

            <div className='card card-header'>
               <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={KMEANSLoader} outerCircleColor=""/> 
              {
                  KMEANSVisible === true ?  <div>
                   <img src={`data:image/png;base64,${KMEANS}`} alt='KMeans Plot' className={`${styles.wcssimg}`}></img> 
                   <div className='card-header'>
                     {     
                           KMEANSScore.map((val,ind)=>(
                             <img src={`data:image/png;base64,${val}`} alt='silhoutee' className={`${styles.silhouteeimg}`} key={ind}></img>
                           ))
                            
                     }
                   </div>
                   
                                 </div> : null  
              }
            </div>
            
                
        </div> 

        <div>
            <Toast ref={toast}></Toast>
            <Messages ref={msgs1} /> 
            <h5 className={`text-center card-footer ${styles.retaildescheader}`}>DBSCAN (Density Based Spatial Clustering Applications with Noise)</h5>   

            <div className={`${styles.wcss} card-header`}>
                <h6 className={`${styles.wcssheader} text-center card-header`}>K Distance Graph and Knee Locator Graph for Optimal Epsilon</h6>
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={KDLDrop} options={feature_names} onChange={(e) => SetKDLDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={KDLGraph} className={`${styles.retailzoomcal}`} />

            </div>  

            <div className='card card-header'>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={KDLLoader} outerCircleColor=""/> 
                {
                    KDLVisible === true ?  <div className={`${styles.KDLdiv}`}>
                          <img src={`data:image/png;base64,${KD}`} alt='K Distance' className={`${styles.wcssimg}`}></img>
                          <img src={`data:image/png;base64,${KL}`} alt='Knee Locator' className={`${styles.wcssimg}`}></img>
                          <h3 className={`${styles.dbscanreshead} card-header`}>{"Optimal Epsilon Value is "+OptEps}</h3>
                        </div> : null  
                }
            </div> 


            <div className={`${styles.wcss} card-header`}>
                <h6 className={`${styles.wcssheader} text-center card-header`}>Hyper Parameter Efficiency Analyser. Epsilon and MinPts vs Silhoutee Score</h6>
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={HyperDrop} options={feature_names} onChange={(e) => SetHyperDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={HyperAnalyser} className={`${styles.retailzoomcal}`} />

            </div>  

            <div className='card card-header'>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={HyperLoader} outerCircleColor=""/> 
                {
                    HyperVisible === true ?  <div className={`${styles.KDLdiv}`}>
                      <img src={`data:image/png;base64,${Hyper3D}`} alt='Hyper 3D' className={`${styles.silhouteeimg}`}></img>
                      <img src={`data:image/png;base64,${Eps2D}`} alt='Epsilon 2D' className={`${styles.silhouteeimg}`}></img>
                      <img src={`data:image/png;base64,${Mps2D}`} alt='Min pts 2D' className={`${styles.silhouteeimg}`}></img>
                      
                    </div> : null  
                }
            </div> 


            <div className={`${styles.wcss} card-header`}>
                <h6 className={`${styles.wcssheader} text-center card-header`}>DBSCAN Model Builder. Build your model below.</h6>
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={DBSRC} options={feature_names} onChange={(e) => SetDBSRC(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Dropdown value={DBEPS} options={epsilonarr} onChange={(e) => SetDBEPS(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Epsilon Values"/> 
                <Dropdown value={DBMPS} options={minptsarr} onChange={(e) => SetDBMPS(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Min Points Value"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={DBSCANModel} className={`${styles.retailzoomcal}`} />

            </div>  

            <div className='card card-header'>
                <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={DBLoader} outerCircleColor=""/> 
                {
                    DBVisible === true ?  <div className={`${styles.KDLdiv}`}>
                      <img src={`data:image/png;base64,${DBSCAN}`} alt='DBSCAN' className={`${styles.silhouteeimg}`}></img> 
                      <h3 className='card-footer text-center bg-warning'>DBSCAN Model Summary</h3>
                      <h3 className={`${styles.dbscanreshead} card-header`}>{"Cluster Size is "+ Cluster}</h3> 
                      <h3 className={`${styles.dbscanreshead} card-header`}>{"V Score is "+VScore}</h3> 
                      <h3 className={`${styles.dbscanreshead} card-header`}>{"Noise is  "+Noise}</h3> 
                     
                    </div> : null  
                }
            </div>



        </div> 

        <div>
            <Toast ref={toast}></Toast>
            <Messages ref={msgs1} /> 
            <h4 className={`text-center card-footer ${styles.retaildescheader}`}>Gaussian Mixture Model</h4>   

            <div className={`${styles.wcss} card-header`}>
                <h6 className={`${styles.wcssheader} text-center card-header`}>Build Your Model Below Gaussian Mixture Model.</h6>
                <Toast ref={toast}></Toast>
                <Messages ref={msgs1} /> 
                <Dropdown value={GMMDrop} options={feature_names} onChange={(e) => SetGMMDrop(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Feature Name"/> 
                <Dropdown value={GMMCluster} options={clustersize} onChange={(e) => SetGMMCluster(e.value)} className={`${styles.retailzoomdrop} bg-light text-black`} placeholder="Select a Cluster Size"/> 
                <Button label="Submit" icon="pi pi-check" iconPos="right"  onClick={GaussianModel} className={`${styles.retailzoomcal}`} />

            </div> 

        <div className='card card-header'>
           <CirclesWithBar height="100" width="100" color="cyan" wrapperStyle={{}} wrapperClass="" visible={GMMLoader} outerCircleColor=""/> 
          {
              GMMVisible === true ?  <div>
                <img src={`data:image/png;base64,${GMM}`} alt='GMM Plot' className={`${styles.silhouteeimg}`}></img>  
                <h2 className={`text-center bg-warning`}>Gaussian Mixture Model Summary</h2>
                <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Converged Log Likelihood Value "+GMMLog}</h3>
                <h3 className={`${styles.retaildescheader} text-center card-header`}>{"Maximum Iteration is  "+GMMIter}</h3>
                
                </div> : null  
          }
        </div> 
        </div>
    
        <div>
            <h3 className={`${styles.copyright} text-center card-footer`}>Digiverz KAAR Techologies Pvt Limited CopyRight @ {" " +copyright}</h3>
       </div>

    </div>
  )
}

export default RetailSegmentation