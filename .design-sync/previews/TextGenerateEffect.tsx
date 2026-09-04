import { TextGenerateEffect } from 'ace-services';

export const Default = () => (
  <div className="max-w-xl text-2xl font-semibold text-gray-900">
    <TextGenerateEffect words="Precise cost estimates and reliable takeoffs for every project." />
  </div>
);

export const WithSubtext = () => (
  <div className="max-w-xl text-2xl font-semibold text-gray-900">
    <TextGenerateEffect
      words="Building better, faster, together."
      sub="From cost estimating to full architectural and structural services."
      subColor="#4b5563"
    />
  </div>
);
