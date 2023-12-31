import React from "react";
import { Link } from "react-router-dom";
import { email_regex } from "../assets/js/utils/functions";
import { post_request } from "../assets/js/utils/services";
import Stretch_button from "../components/stretch_button";
import { Loggeduser } from "../Contexts";
import Footer from "../sections/footer";
import Nav from "../sections/nav";

const code_gx = /^[0-9]{6}$/;

class Verify_email extends React.Component {
  constructor(props) {
    super(props);

    this.state = { verification_code: "" };
  }

  componentDidMount = () => {
    let href = window.location.href;
    href = href.split("?");
    if (href[1]) {
      href = href[1]
        .split("&")
        .filter((ref) => ref.trim().split("=")[0] === "addr");
      if (href) {
        href = href[0].split("=")[1];
        this.setState({ email: href });
      }
    }
  };

  is_set = () => {
    let { verification_code } = this.state;

    return code_gx.test(verification_code.trim());
  };

  verify = async (e) => {
    let { email, verification_code } = this.state;
    if (!email_regex.test(email) || !code_gx.test(verification_code.trim()))
      return this.setState({ message: "Invalid entry" });

    this.setState({ loading: true });

    let result = await post_request("verify_email", {
      email,
      verification_code,
    });
    if (!result._id)
      return this.setState({
        message: result?.message || "Err something went wrong.",
      });

    this.login(result);
    document.getElementById("click_login").click();
  };

  render() {
    let { email, verification_code, edited, message, loading } = this.state;

    return (
      <Loggeduser.Consumer>
        {({ login }) => {
          this.login = login;

          return (
            <div id="main-wrapper">
              <Nav page="Verify_email" />
              <section>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-xl-7 col-lg-8 col-md-12 col-sm-12">
                      <form>
                        <div className="crs_log_wrap">
                          <div className="crs_log__thumb">
                            <img
                              src={require("../assets/img/forgot_pass_bg2.jpg")}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                          <div className="crs_log__caption">
                            <div className="rcs_log_123">
                              <div className="rcs_ico">
                                <i className="fas fa-lock"></i>
                              </div>
                            </div>

                            <div className="rcs_log_124">
                              <div className="Lpo09">
                                <h4>Verify Email</h4>
                              </div>

                              {email && !edited ? (
                                <div class="alert alert-primary" role="alert">
                                  A 6-digit code has been sent to{" "}
                                  <strong>
                                    <em>{email}</em>
                                  </strong>
                                </div>
                              ) : null}

                              <div className="form-group">
                                <label>Email Address</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="you@mail.com"
                                  value={email}
                                  disabled
                                  onChange={({ target }) =>
                                    this.setState({
                                      email: target.value,
                                      edited: true,
                                      message: "",
                                    })
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label>Verification Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="x x x x x x"
                                  value={verification_code}
                                  onChange={({ target }) =>
                                    this.setState({
                                      verification_code: target.value,
                                      message: "",
                                    })
                                  }
                                />
                              </div>
                              {message ? (
                                <div class="alert alert-danger" role="alert">
                                  {message}
                                </div>
                              ) : null}

                              <div className="form-group">
                                <Link to="/" id="click_login"></Link>
                                <Stretch_button
                                  action={this.verify}
                                  title="Verify"
                                  loading={loading}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              <Footer />
            </div>
          );
        }}
      </Loggeduser.Consumer>
    );
  }
}

export default Verify_email;
