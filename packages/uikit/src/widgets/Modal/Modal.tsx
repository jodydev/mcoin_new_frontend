import React, { PropsWithChildren, useRef } from "react";
import { useTheme } from "styled-components";
import Heading from "../../components/Heading/Heading";
import getThemeValue from "../../util/getThemeValue";
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from "./styles";
import { ModalProps, ModalWrapperProps } from "./types";
import { useMatchBreakpoints } from "../../contexts";

export const MODAL_SWIPE_TO_CLOSE_VELOCITY = 300;

export const ModalWrapper = ({
  children,
  onDismiss,
  minWidth,
  hideCloseButton,
  ...props
}: PropsWithChildren<ModalWrapperProps>) => {
  const { isMobile } = useMatchBreakpoints();
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    // @ts-ignore
    <ModalContainer
      drag={isMobile && !hideCloseButton ? "y" : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = "none";
      }}
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss();
      }}
      ref={wrapperRef}
      $minWidth={minWidth}
      {...props}
    >
      {children}
    </ModalContainer>
  );
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = "24px",
  headerBackground = "transparent",
  minWidth = "320px",
  ...props
}) => {
  const theme = useTheme();
  return (
    <ModalWrapper minWidth={minWidth} onDismiss={onDismiss} hideCloseButton={hideCloseButton} {...props}>
      <ModalHeader background={getThemeValue(theme, `colors.${headerBackground}`, headerBackground)}>
      <ModalTitle>
        <p className="ms-5 text-center text-white fs-5 fw-semibold mt-3 mb-1" style={{ flex: 1, textAlign: 'center' }}>{title}</p>
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} style={{ marginLeft: 'auto' }} />}
      </ModalTitle>
      </ModalHeader>
      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalWrapper>
  );
};

export default Modal;
