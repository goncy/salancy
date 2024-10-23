import {ImageResponse} from "next/og";

export const alt = "Salancy";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexWrap: "nowrap",
          backgroundColor: "#111",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(211, 211, 211, 0.25) 1%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(211, 211, 211, 0.25) 1%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 128,
            marginBottom: -48,
          }}
        >
          💸
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontStyle: "normal",
            color: "white",
            marginTop: 5,
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            marginBottom: -36,
          }}
        >
          <b>Salancy</b>
        </div>
        <p style={{fontSize: 32, color: "#c0c0c0"}}>Encontrá tu próximo salario</p>
      </div>
    ),
    {
      ...size,
    },
  );
}
