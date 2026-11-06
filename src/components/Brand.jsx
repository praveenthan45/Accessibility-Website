import { site } from '../config/site';

export default function Brand() {
  return <img className="brand" src="/images/pluga11y-logo.svg" alt={site.name} width="1340" height="359" />;
}
