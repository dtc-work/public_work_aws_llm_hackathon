class Recorder extends AudioWorkletProcessor {
  process(inputs) {
    const inputFloat32 = inputs[0][0];  // 入力音声データ (Float32Array)

    if (inputFloat32) {
      // Float32Array から Int16Array に変換する
      const inputInt16 = new Int16Array(inputFloat32.length);
      for (let i = 0; i < inputFloat32.length; i++) {
        // -1.0 ～ 1.0 の範囲を -32768 ～ 32767 にスケーリング
        inputInt16[i] = Math.max(-32768, Math.min(32767, inputFloat32[i] * 32768));
      }

      // メインスレッドに Int16 データを送信
      this.port.postMessage(inputInt16);
    }

    return true;  // 処理を継続する
  }
}

registerProcessor("recorder", Recorder);
