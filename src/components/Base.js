import CustomNavbar from "./CustomNavbar";

const Base = ({ title = "Welcome to our webiste", children }) => {
  return (
    <div className="container-fluid"style={{
      
      backgroundImage:
        `url(${process.env.REACT_APP_S3_URL}/images/background.PNG)`,
      backgroundSize: "104% auto", 
 
    }}>
    <CustomNavbar/>
      {children}
     
      
    </div>
  );
};
export default Base;
