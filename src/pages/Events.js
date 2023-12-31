import React from "react";
import { post_request } from "../assets/js/utils/services";
import Event from "../components/event";
import Events_sidebar from "../components/events_sidebar";
import Listempty from "../components/listempty";
import Loadindicator from "../components/loadindicator";
import Padder from "../components/padder";
import Vouchers_header from "../components/vouchers_header";
import Breadcrumb_banner from "../sections/breadcrumb_banner";
import Footer from "../sections/footer";
import Nav from "../sections/nav";

class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 15,
      page: 1,
    };
  }

  fetch_tickets = async (category) => {
    let { limit, page, category: cat } = this.state;
    if (!category) category = cat;
    this.setState({ fetching: true });

    let { events, total } = await post_request(`events`, {
      limit,
      skip: limit * (page - 1),
      query: category ? { category } : null,
    });

    this.setState({ events, total, category, fetching: false });
  };

  componentDidMount = async () => {
    let search = window.location.search;

    if (search) search = search.slice(1);

    await this.fetch_tickets(search);
  };

  set_category = (category) => this.setState({ category }, this.fetch_tickets);

  render() {
    let { events, total, fetching, page, limit, category } = this.state;

    return (
      <div>
        <Nav page="tickets" />

        <Padder />
        <Breadcrumb_banner page="Tickets" />

        <section className="gray">
          <div className="container">
            <div className="row">
              <Events_sidebar
                set_category={this.set_category}
                category={category}
              />

              <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <Vouchers_header
                  length={events && events.length}
                  total={total}
                  page={page}
                  limit={limit}
                />

                <div class="row justify-content-center">
                  {events && !fetching ? (
                    events.length ? (
                      events.map((event, index) => (
                        <Event event={event} in_events key={index} />
                      ))
                    ) : (
                      <Listempty />
                    )
                  ) : (
                    <Loadindicator />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default Events;
