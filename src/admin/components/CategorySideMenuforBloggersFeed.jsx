
import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { loadAllCategories } from "../../services/CategoryServices";
function CategorySideMenuforBloggersFeed() {
   
   const [categories, setCategories] = useState([]);

   useEffect(() => {
     console.log("hello")
     loadAllCategories()
       .then((data) => {
         setCategories([...data]);
       })
       .catch((error) => {
         console.error(error);
         toast.error("Error in loading categories");
       });
   }, []);
 
   return (
     <div>
     <ListGroup>
       <ListGroupItem tag={Link} to="/home/admin" action>
         <b>All Blogs </b>
       </ListGroupItem>
 
       {categories &&
         categories.map((cat, index) => {
           return (
             <ListGroupItem
               tag={Link}
               to={"/admin/categorie/" + cat.categoryId}
               className="border-0 shadow-8"
               key={index}
               action
             >
               <b>{cat.categoryTitle}</b>
             </ListGroupItem>
           );
         })}
     </ListGroup>
   </div>
   )
}

export default CategorySideMenuforBloggersFeed