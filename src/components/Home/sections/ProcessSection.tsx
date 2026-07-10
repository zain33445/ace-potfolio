import ProcessFlow from '../../../components/ProcessFlow';
import RenderOnViewport from '../../../components/RenderOnViewport';

export default function ProcessSection() {
  return (
    <div id="process" className="py-24 px-6 md:px-16 bg-background border-b border-blueprint-line relative">
      <div className="container mx-auto max-w-7xl">
        <RenderOnViewport rootMargin="400px" placeholder={<div className="h-[600px] flex items-center justify-center"><div className="font-mono text-xs text-primary animate-pulse">Loading estimation engine...</div></div>}>
          <ProcessFlow />
        </RenderOnViewport>
      </div>
    </div>
  );
}
