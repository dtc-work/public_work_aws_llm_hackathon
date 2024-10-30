// src/client/frontend/src/features/InterviewSimulationPage.tsx
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar3 from "../assets/images/gal.png";
import Avatar1 from "../assets/images/japanese_man.png";
import Avatar2 from "../assets/images/japanese_woman.png";
import micIcon from "../assets/images/mic.svg";
import Avatar4 from "../assets/images/old_man.png";
import pauseIcon from "../assets/images/pause.svg";
import recordIcon from "../assets/images/record-circle.svg";
import sendIcon from "../assets/images/send_text.svg";
import ChatMessages from "../components/ChatMessages";
import Header from "../components/Header";
import { API_V1_PATH, HOST, HOST_WS } from "../config";

// 型定義
interface Message {
  type: "user" | "server";
  content: string;
  avatar_type: string;
}

interface LocationState {
  company_id: number;
  company_name: string;
  company_description: string;
  avatar_id: number;
}

const InterviewSimulationPage: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState<"before" | "recording" | "stopped" | false>(false);
  const [showSimulationInfo, setShowSimulationInfo] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態管理
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showAvatar, setShowAvatar] = useState<boolean>(true); // アバター表示管理
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const {
    company_id,
    company_name,
    company_description,
    avatar_id,
  } = (location.state as LocationState) || {
    company_id: 0,
    company_name: "",
    company_description: "",
    avatar_id: 0,
  };
  useEffect(() => {
    console.log("Received Company ID:", company_id);
    console.log("Received Avatar ID:", avatar_id);
  }, [company_id, avatar_id]);

  // avatar_id に基づいて画像を返す関数
  const getAvatarImage = (id: number) => {
    switch (id) {
      case 1:
        return Avatar1;
      case 2:
        return Avatar2;
      case 3:
        return Avatar3;
      case 4:
        return Avatar4;
      default:
        return Avatar1; // デフォルトのアバター画像
    }
  };

  // avatar_idに基づいて画像を取得
  const avatarImage = getAvatarImage(avatar_id);

  // jsonかどうか判定する関数
  const isJson = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  // WebSocketの接続
  const connectWebSocket = () => {
    ws.current = new WebSocket(`${HOST_WS}${API_V1_PATH}ws/simulation`);

    ws.current.onopen = () => {
      setIsConnected(true);
      const payload = JSON.stringify({
        company_id: company_id,
        avatar_id: avatar_id,
      });
      ws.current?.send(payload);
    };

    ws.current.onmessage = async (event) => {
      if (isJson(event.data) && "transcribe_result" in JSON.parse(event.data)) {
        const transcribe_result = JSON.parse(event.data).transcribe_result;
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "user", content: transcribe_result, avatar_type: avatarImage},
        ]);
      } else {
        console.log(event.data);

        if (showAvatar) { // TODO: 切り替えられるようにする(現状trueに切り替わらない)
          const videoResponse = await generateVideo(event.data, avatar_id, avatarImage);
          console.log(videoResponse);
          setVideoUrl(videoResponse); // 生成された動画URLをセット
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "server", content: event.data, avatar_type:avatarImage},
        ]);
        setLoading(false); // 処理終了時にローディング終了
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };
  };

  // WebSocket接続をページロード時に開始
  useEffect(() => {
    setLoading(true); //ページロード時にローディング開始
    connectWebSocket();
    setMessages((prevMessages) => [
          ...prevMessages,
          { type: "server", content: `シミュレーション開始までお待ちください。`, avatar_type:avatarImage },
           ]);
    return () => {
      ws.current?.close(); // ページがアンマウントされる際にWebSocketを閉じる
    };
  }, []);

  // チャットメッセージを送信する処理
  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (ws.current && newMessage && isConnected) {
      setLoading(true); // メッセージ送信時にローディング開始
      ws.current.send(newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", content: newMessage, avatar_type:avatarImage },
      ]);
      setNewMessage("");
    }
  };

  const startRecording = async () => {
    setIsRecording("recording");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const context = new AudioContext({ sampleRate: 44100 });
    const source = context.createMediaStreamSource(stream);

    await context.audioWorklet.addModule("/audio-processor.js");

    const audioWorkletNode = new AudioWorkletNode(context, "recorder");
    source.connect(audioWorkletNode);
    audioWorkletNode.connect(context.destination);

    setAudioContext(() => context);
    setUserMedia(() => stream);

    audioWorkletNode.port.onmessage = (msg) => {
      if (ws.current && isConnected) {
        ws.current.send(msg.data.buffer);
      }
    };
  };

  const stopRecording = async () => {
    setIsRecording(false);
    // サーバサイドに録音停止を通知する
    if (ws.current && isConnected) {
      ws.current.send('{"stop": true}');
    }

    /**
     * 音声リソースを全て解放
     * @see https://developer.mozilla.org/ja/docs/Web/API/AudioContext/close
     */
    if (audioContext) {
      audioContext.close();
      console.log("close AudioContext");
    }

    /**
     * ブラウザでアクセスしているオーディオの停止
     * @see https://developer.mozilla.org/ja/docs/Web/API/MediaStream/getAudioTracks
     */
    if (userMedia) {
      for (const media of userMedia.getAudioTracks()) {
        media.stop();
      }
    }

    setLoading(true);
  };

  const generateVideo = async (text: string,　avatar_id: number, image_path: string) => {
    const url = `${HOST}${API_V1_PATH}generate-video`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, avatar_id, image_path }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail);
    console.log(data);
    return data.video_url; // 動画URLを返す
  };

  useEffect(() => {
    if (videoUrl) {
      const videoElement = document.getElementById('video-player') as HTMLVideoElement;
      if (videoElement) {
        videoElement.src = videoUrl;
        videoElement.play().catch((error) => console.error('自動再生エラー:', error));
      }
      setLoading(false); // 動画表示時にローディング終了
    }
  }, [videoUrl]);

   // ウィンドウのリサイズでモバイル幅をチェック
   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // チャット画面を自動スクロール
  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Header
        title="トップ > シミュレーション"
        breadcrumbs={[
          { label: "トップ", link: "/" },
          { label: "シミュレーション", link: "/simulation" },
        ]}
      />
      <div className="interview-simulation-page main-container">
      {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div> {/* スピナーの表示 */}
          </div>
        )}
        {showAvatar && (
          <div className="video-modal" style={{top: isMobile && showSimulationInfo ? "30%" : "",}}>
            <button onClick={() => setShowAvatar(false)} className="close-avatar-button">
              ×
            </button>
          {videoUrl && (
            <video className="video" src={videoUrl} autoPlay style={{ width: "100%", maxHeight: "400px" }} />
          )}
          </div>
        )}
      <button onClick={() => setShowAvatar(true)} className="open-avatar-button" style={{
          display: !showAvatar ? "block" : "none",}}>
        アバターを表示する
      </button>
      <button onClick={() => setShowSimulationInfo(true)} className="open-modal-button" style={{
          display: !showSimulationInfo ? "block" : "none",}}>
        企業情報を表示する
      </button>
        {showSimulationInfo && (
          <div className="simulation-info-modal">
            <button className="close-modal-button" onClick={() => setShowSimulationInfo(false)}>×</button>
            <div className="simulation-info-content">
              <p className="simulation-title">{company_name} 面接シミュレーション...</p>
              <p className="simulation-point">ポイント： {company_description}</p>
            </div>
          </div>
        )}
        <div className="chat-main-container" style={{
          marginTop: showAvatar || showSimulationInfo ? "30px" : "0", // モーダルが開いているときだけ margin-top を適用
          transition: "margin-top 0.3s ease", // スムーズなトランジション
        }}>
        <ChatMessages messages={messages} />
        <form onSubmit={sendMessage} className="chat-input-form">
          <div className="voice-input">
            {!isRecording ? (
              <>
                <textarea
                  placeholder="ここに入力してください"
                  className="text-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                ></textarea>
                <div className="voice-controls">
                  <button className="voice-button" onClick={() => setIsRecording("before")}>
                    <img src={micIcon} alt="Voice Input" />
                  </button>
                  <button type="submit" className="send-button" disabled={!isConnected}>
                    <img src={sendIcon} alt="Send" />
                  </button>
                </div>
              </>
            ) : isRecording === "before" ? (
              <div className="recording-area">
                <div className="flex anounce-area">
                  <p>ボタンを押して音声入力を開始する。</p>
                  <button
                    className="close-button"
                    onClick={() => setIsRecording(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="recording-controls">
                  <button className="record-button">
                    <img
                      src={recordIcon}
                      alt="Record"
                      onClick={() => startRecording()}
                    />
                  </button>
                </div>
              </div>
            ) : isRecording === "recording" ? (
              <div className="recording-area">
                <div className="flex announce-area">
                  <p>録音中... 完了するには停止ボタンを押してください。</p>
                  <button
                    className="close-button"
                    onClick={() => setIsRecording(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="recording-controls">
                  <button
                    className="stop-button"
                    onClick={() => stopRecording()}
                  >
                    <img src={pauseIcon} alt="Stop" />
                  </button>
                </div>
              </div>
            ) : isRecording === "stopped" ? (
              <div className="recording-area">
                <div className="flex announce-area">
                  <p>
                    録音が停止しました。再度録音するか、送信ボタンを押してください。
                  </p>
                  <button
                    className="close-button"
                    onClick={() => setIsRecording(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default InterviewSimulationPage;
