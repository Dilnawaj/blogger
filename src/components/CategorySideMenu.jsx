import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { loadAllCategories } from "../services/CategoryServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function CategorySideMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("Bello")
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
        <ListGroupItem tag={Link} to="/user/Feed" action>
          <b>All Blogs </b>
        </ListGroupItem>

        {categories &&
          categories.map((cat, index) => {
            return (
              <ListGroupItem
                tag={Link}
                to={"/categories/" + cat.categoryId}
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
  );
}

export default CategorySideMenu;
