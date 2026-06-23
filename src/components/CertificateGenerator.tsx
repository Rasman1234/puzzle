import { CERTIFICATE_TEMPLATES, downloadCertificate } from '../lib/certificateGenerator';
import { playClickSound } from '../lib/audio';

export function CertificateGenerator() {
  return (
    <div className="certificate-generator">
      <h3 className="cert-heading">📜 Certificates</h3>
      <p className="panel-subtitle">Download a printable certificate!</p>
      <div className="cert-grid">
        {CERTIFICATE_TEMPLATES.map((cert) => (
          <button
            key={cert.achievementName}
            type="button"
            className="btn cert-btn"
            onClick={() => { playClickSound(); downloadCertificate(cert); }}
          >
            {cert.emoji} {cert.title}
          </button>
        ))}
      </div>
    </div>
  );
}
