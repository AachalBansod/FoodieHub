import React,{lazy, Suspense} from "react";
import ReactDOM from "react-dom/client";
import '../index.css';
import HeaderComponent from "./component/Header"
import Body from "./component/Body";
import Footer from "./component/Footer";
import About from "./component/About";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import  Error from "./component/Error";
import Contact from "./component/contact";
import RestrauntMenu from "./component/RestrauntMenu";
import {Provider} from "react-redux";
import store from "./utils/store";
import Cart from "./component/Cart";

const Instamart = lazy(()=>import("./component/Instamart"));
const AppLayout=() =>{

  return(
    <Provider store={store}>
    <>
     <HeaderComponent/>
     <Outlet></Outlet>
     <Footer/>
     </>
     </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path : "/",
    element : <AppLayout/>,
    errorElement: <Error/>,
    children:[
      {
        path : "/",
        element:<Body/>,
       },
       {
        path : "/about",
        element:<About/>,
       },
       {
        path : "/contact",
        element:<Contact/>,
       },
       {
        path:"/restaurant/:id",
        element:<RestrauntMenu></RestrauntMenu>
       },
       {
        path:"/instamart",
        element: (
          <Suspense>
            <Instamart/>
            </Suspense>)
       },
       {
        path:"/cart",
        element:(
          <Cart></Cart>
        )
       }

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter}/> );
