import { Component } from 'react';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      time: "",
      date: "",
      minRating: 1,
      error:{
        timeError: false,
        dateError: false,
        errors: []
      }
    };

  }

  changeTime(e){
    let time = e.currentTarget.value.replace(/\s/g, '');
    this.setState({ time });
  }

  changeDate(e){
    let date = e.currentTarget.value.replace(/\s/g, '');
    this.setState({ date });
  }

  changeRating(e){
    let minRating = parseInt(e.currentTarget.value);
    this.setState({ minRating });
  }

  changeOpenStatus(){
    this.setState({isOpen: !this.state.isOpen});
  }
  update(){
    const { updateMarkers } = this.props;
    const { time, date, minRating, error } = this.state;
    var timeRegex = /^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i;
    let dateRegex = /^([0]?[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

    if (!timeRegex.test(time) && !dateRegex.test(date)){
      this.setState({
        error: {
          timeError: true,
          dateError: true,
          errors: ["Error with time format", "Error with date format"]
        }
      });
    } else if (!timeRegex.test(time)){
      this.setState({
        error: {
          timeError: true,
          dateError: false,
          errors: ["Error with time format"]
        }
      });
    } else if (!dateRegex.test(date)){
      this.setState({
        error: {
          timeError: false,
          dateError: true,
          errors: ["Error with date format"]
        }
      });
    } else {
      this.setState({
        error: {
          timeError: false,
          dateError: false,
          errors: []
        }
      });
      updateMarkers(this.state);
    }
  }
  render() {
    const { timeError, dateError, errors } = this.state.error;
    const { isOpen } = this.state;
    return (
      <div>
        <div className="menu">

          <label>
            Open Time: &nbsp;
            <input type="text"
              placeholder="ex: 7:00AM"
              className={ timeError ? "fail" : "success" }
              onChange={this.changeTime.bind(this)}
              />
          </label><br/>
          <label>
            Open date: &nbsp;&nbsp;
            <input type="text"
              placeholder="ex: 6/29/2017"
              className={ dateError ? "fail" : "success" }
              onChange={this.changeDate.bind(this)}
              />
          </label><br/>
          <label>
            Min rating: 1 &nbsp;
            <input type="range"
              onChange={this.changeRating.bind(this)}
              min="1"
              max="5" />
            &nbsp;5
          </label><br/>
          <input type="button" value="Update options"
            onClick={()=> this.update()}
            />
          </div>
          <div className={ errors.length > 0 ? "errors" : "hidden" }>
              {errors.map((e,index) => (
                <span key={index}>{e}</span>
              ))}
          </div>
          <style jsx>{`
              .menu {
                position: fixed;
                width: 300px;
                height: 100px;
                bottom: 10px;
                right: 62px;
                background: white;
                z-index: 10;
                border: 1px solid lightgray;
                padding: 5px;
              }
              .fail {
                background: pink;
              }
              .success {
                background: white;
              }
              .errors {
                display: flex;
                flex-direction: column;
                position: fixed;
                width: 300px;
                background: red;
                padding: 5px;
                bottom: 122px;
                right: 62px;
              }
              .hidden {
                visibility: false;
              }
              `}</style>
      </div>
    );
  }
}
