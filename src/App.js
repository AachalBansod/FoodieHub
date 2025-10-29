import React from "react";
import ReactDOM from "react-dom/client";
import '../index.css';
import HeaderComponent from "./component/Header"
import Body from "./component/Body";
import Footer from "./component/Footer";
import About from "./component/About";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import  Error from "./component/Error";
import Contact from "./component/Contact";
import RestrauntMenu from "./component/RestrauntMenu";
import {Provider} from "react-redux";
import store from "./utils/store";
import Cart from "./component/Cart";
import Favorites from "./component/Favorites";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Orders from "./component/Orders";
const AppLayout = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        <HeaderComponent />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
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
        element:<Home/>,
       },
       {
        path : "/restaurants",
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
        path:"/cart",
        element:(
          <Cart></Cart>
        )
       }
       ,
       {
        path:"/favorites",
        element:(
          <Favorites />
        )
       }
       ,
       {
        path:"/orders",
        element:(
          <Orders />
        )
       }
       ,
       {
        path:"/login",
        element:(
          <Login />
        )
       }
       ,
       {
        path:"/signup",
        element:(
          <Signup />
        )
       }

    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter}/> );
