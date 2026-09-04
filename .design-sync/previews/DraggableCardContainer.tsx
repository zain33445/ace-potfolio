import { DraggableCardContainer, DraggableCardBody } from 'ace-services';

export const Default = () => (
  <DraggableCardContainer>
    <DraggableCardBody className="w-64 rounded-xl bg-white p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-gray-900">Drag me</h3>
      <p className="mt-2 text-sm text-gray-600">
        A tilting, draggable card built on Framer Motion — used for project highlights and testimonials.
      </p>
    </DraggableCardBody>
  </DraggableCardContainer>
);
