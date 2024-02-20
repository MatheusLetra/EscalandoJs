import Campo from "./components/Campo"
import CampoMobile from "./components/CampoMobile"



function App() {

  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) { 
    return (

      <CampoMobile />
    )
  }
  else {
    return (

      <Campo />
    )
  }


}

export default App
