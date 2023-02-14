import React from "react";
import Stretch_button from "./stretch_button";

class Voucher_otp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let { toggle, redeeming, clear_message, message, proceed } = this.props;
    let { code } = this.state;

    return (
      <div>
        <div class="modal-content overli" id="loginmodal">
          <div class="modal-header">
            <h5 class="modal-title">Enter Voucher OTP</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => toggle && toggle()}
            >
              <span aria-hidden="true">
                <i class="fas fa-times-circle"></i>
              </span>
            </button>
          </div>
          <div class="modal-body">
            <div class="login-form">
              <form>
                <div class="form-group">
                  <label>OTP</label>
                  <div class="input-with-icon">
                    <input
                      type="text"
                      class="form-control"
                      value={code}
                      onChange={({ target }) =>
                        this.setState(
                          {
                            code: target.value,
                          },
                          clear_message
                        )
                      }
                      placeholder="* * * * * *"
                    />
                    <i class="ti-user"></i>
                  </div>
                </div>

                {message ? <p className="text-danger">{message}</p> : null}

                <div class="form-group">
                  <Stretch_button
                    title={redeeming ? "redeeming" : "redeem"}
                    action={() => proceed && proceed(code)}
                    disabled={redeeming}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Voucher_otp;
