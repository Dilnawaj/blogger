import CustomNavbar from "./CustomNavbar";

const Base = ({ title = "Welcome to our webiste", children }) => {
  return (
    <div className="container-fluid"style={{
      
      backgroundImage:
        'url("http://localhost:5000/post/image/background.png")',
      backgroundSize: "104% auto", 
 
    }}>
    <CustomNavbar/>
      {children}
     
      
    </div>
  );
};
export default Base;
