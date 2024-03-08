import "./App.css";
import { useEffect } from "react";
import {
  PayableOverrides,
  TradeActionBNStr,
  TokenPair,
  MatchActionBNStr,
  StrategyUpdate,
  EncodedStrategyBNStr,
} from "@bancor/carbon-sdk";
import { Toolkit } from "@bancor/carbon-sdk/strategy-management";
import { ChainCache, initSyncedCache } from "@bancor/carbon-sdk/chain-cache";
import {
  ContractsApi,
  ContractsConfig,
} from "@bancor/carbon-sdk/contracts-api";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

const App = () => {
  let api: ContractsApi;
  let sdkCache: ChainCache;
  let carbonSDK: Toolkit;
  let isInitialized = false;
  let isInitializing = false;

  function onPairDataChanged(affectedPairs: any) {
    console.log(`onPairDataChanged => affectedPairs: ${affectedPairs}`);
  }

  function onPairAddedToCache(affectedPairs: any) {
    console.log(`onPairAddedToCache => affectedPairs: ${affectedPairs}`);
  }

  const init = async (
    rpcUrl: string,
    config: ContractsConfig,
    decimalsMap?: Map<string, number>,
    cachedData?: string
  ) => {
    if (isInitialized || isInitializing) return;
    isInitializing = true;
    const provider = new StaticJsonRpcProvider(rpcUrl);
    api = new ContractsApi(provider, config);
    const { cache, startDataSync } = initSyncedCache(api.reader, cachedData);
    sdkCache = cache;
    carbonSDK = new Toolkit(
      api,
      sdkCache,
      decimalsMap
        ? (address) => decimalsMap.get(address.toLowerCase())
        : undefined
    );
    sdkCache.on("onPairDataChanged", (affectedPairs) =>
      onPairDataChanged(affectedPairs)
    );
    sdkCache.on("onPairAddedToCache", (affectedPairs) =>
      onPairAddedToCache(affectedPairs)
    );
    await startDataSync();
    isInitialized = true;
    isInitializing = false;

    return carbonSDK;
  };
  useEffect(() => {
    const rpcurl = "http://localhost:8889/";
    init(rpcurl, {});
  }, []);

  return (
    <div className="App">
      <h1>Xfai Interview</h1>
    </div>
  );
};

export default App;
