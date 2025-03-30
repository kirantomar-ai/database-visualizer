import MongoIconImg from "./images/mongo_icon.jpeg";
import MySQLIconImg from "./images/mysql_icon.jpeg";

export const MongoIcon = (props) => {
  return <img alt="mongo-icon" src={MongoIconImg} {...props} />;
};
export const MySQLIcon = (props) => {
  return <img alt="sql-icon" src={MySQLIconImg} {...props} />;
};
