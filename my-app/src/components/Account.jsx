// export default function Account() {
//     return <h1>Account Page</h1>;
// }

// import { useState, useEffect } from "react";
// import SingleRestaurant from "./SingleRestaurant";

// // export default function Account({ token, getData }) {

//   const [userName, setUsername] = useState(null);
//   const [useruserRestaurant, setUserRestaurant] = useState([]);
//   const [userInfo, setUserInfo] = useState({});

// //   useEffect(() => {
// //     async function userData() {
// //       const apiToken = token;
// //       try {
// //         const response = await fetch(
// //           "http://localhost:4000/api/users/me",
// //           {
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${apiToken}`,
// //             },
// //           }
// //         );
// //         const result = await response.json();
// //         setUserInfo(result);
// //         setUser(result.email);
// //         setUserRestaurant(result.Restaurant);
// //       } catch (error) {
// //         setError(error.message);
// //       }
// //     }
// //     userData();
// //   }, [token]);

// //   return (
// //     <div className="userInfo">
// //       <h1>Welcome to Kendall's Resturaunt Review Hub {userName}</h1>
// //       <h2>{userInfo.email}</h2>
// //       <h3>Your reserved books:</h3>
// //       <div className="books">
// //         <div className="singlebook">
// //           {userResturaunt &&
// //             userResturaunt.map((restaurant) => (
// //               <SingleRestaurant
// //                 key={restaurant.id}
// //                 restaurant={restaurant}
// //                 pageName={"account"}
// //                 getData={getData}
// //                 token={token}
// //                 userResturaunt={userResturaunt}
// //                 setUserRestaurant={setUserRestaurant}
// //               />
// //             ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


