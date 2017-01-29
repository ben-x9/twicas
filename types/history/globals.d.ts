interface Module {
  hot: {
    accept: () => void;
    dispose: (callback: () => void) => void;
  } | null;
}

declare const module: Module;

interface Process {
  env: {
    NODE_ENV: 'development' | 'production';
  };
}

declare const process: Process;