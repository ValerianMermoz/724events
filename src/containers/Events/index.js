import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);

  const changeType = (evtType) => {
    const foundEvents = data?.events.filter((event) => event.type === evtType);
    console.log("LENGTH ==> ", foundEvents.length);
    setCurrentPage(foundEvents?.length);
    setType(evtType);
  };

  const sortedEvents = data?.events
    ? [...data.events].sort(
        (evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)
      )
    : [];

  const filteredEvents = (type !=="Toutes") ?  ((!type ? sortedEvents : sortedEvents) || []).filter(
    (index) => {
      if (
        (currentPage - 1) * PER_PAGE <= index &&
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    }
  ) : sortedEvents;

  const getEventByType = (eventType) => {
    if (eventType === "Toutes") {
      return data?.events;
    }
    const foundEvents = data?.events.filter(
      (event) => event.type === eventType
    );
    return foundEvents || null;
  };

  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
    <div data-testid="An error occured">
      {error && <div >An error occured</div>}</div>
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select onChange={changeType} selection={Array.from(typeList)} />
          <div id="events" className="ListContainer" data-testid="list-events">
            {getEventByType(type)?.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    key={event}
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                    
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
