import React, {Component} from 'react';
import RenderProfilePage from './profile';
import axios from "axios";


class RenderProfilePictures extends Component {

    constructor(props) {
        super(props);
        this.state = {
        img: null
        };
    }

    componentDidMount() {
        axios
          .get("http://localhost:8000/files")
          .then(res => {
            this.setState({
              img: res.data
            });
          });
      }
      


    render(){
        const DisplayPictures = () => {
            if(this.state.img){
                //this.state.img.forEach(function(file){
                return <div className="card card-body mb-4"><img className = "card-img-top" src = "http://localhost:8000/image/ed9062e33c02d6e39984040777cad276.jpg" alt = ""></img></div>
                //})
            
            } else {
                return <div><p>no images to display</p></div>
            }
        }
        return(<DisplayPictures/>)
    }
}


export default RenderProfilePictures;
