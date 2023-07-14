import { useRef } from "react";
import { Overlay, useModalOverlay } from "react-aria";
import { CSSTransition } from "react-transition-group";
import "./styles/modal.scss";

export default function Modal({ children, state, ...props }) {
  let underlayRef = useRef();
  let modalRef = useRef();
  let { modalProps, underlayProps } = useModalOverlay(props, state, modalRef);

  return (
    <>
      <CSSTransition
        in={state.isOpen}
        timeout={200}
        classNames={"modal-transition"}
        mountOnEnter
        unmountOnExit
        nodeRef={underlayRef}
      >
        <Overlay>
          <div className={"modal-underlay"} ref={underlayRef} {...underlayProps}>
            <div className={"modal"} ref={modalRef} {...modalProps}>
              {children}
            </div>
          </div>
        </Overlay>
      </CSSTransition>
    </>
  );
}
