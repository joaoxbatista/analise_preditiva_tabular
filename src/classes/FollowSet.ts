import { FirstSet } from "./FirstSet";
import { Gramma } from "./Gramma";
import { Production } from "./Production";
import { uniq } from "lodash";
import { SymbolsVerifier } from "./SymbolsVerifier";
export class FollowSet {
  private gramma: Gramma;
  private firstSet: FirstSet;
  private symbolsVerifier: SymbolsVerifier;
  private isDebugger: boolean;
  constructor(gramma: Gramma, isDebugger = true) {
    this.isDebugger = isDebugger;
    this.gramma = gramma;
    this.firstSet = new FirstSet(gramma);
    this.symbolsVerifier = new SymbolsVerifier();
  }

  public getAllProductions(): Array<{ leftSide: string; rightSide: string }> {
    let productions: Array<{ leftSide: string; rightSide: string }> = [];
    this.gramma.getProductions().forEach((production) => {
      const rightSideProductions: Array<{
        leftSide: string;
        rightSide: string;
      }> = [];

      production.getRightSide().forEach((item) => {
        rightSideProductions.push({
          leftSide: production.getLeftSide(),
          rightSide: item,
        });
      });

      productions = [...productions, ...rightSideProductions];
    });

    return productions;
  }

  public getArray(): any {
    const nonTerminals = this.gramma.getNonTerminals();

    const followArray = nonTerminals.map((item) => {
      const follow: Array<string> = [];
      return {
        nonTerminal: item,
        follow,
      };
    });

    nonTerminals.forEach((nonTerminal, index) => {
      followArray[index].follow = this.getFollowSet(nonTerminal);
    });

    return followArray;
  }

  public getFollowSet(nonTerminal: string): Array<string> {
    // 1 - Definir o conjunto follow a ser armazenado
    let followSet: Array<string> = [];

    // 2 - O não terminal é o simbolo inicial
    if (nonTerminal === this.gramma.getInitialSymbol()) {
      this.logger(`Não terminal ${nonTerminal} é o simbolo inicial`);
      followSet.push("$");
    }

    // 3 - Obtem produções que contem o não terminal no lado direito
    const productionsHasNonTerminal = this.getAllProductions().filter(
      (production) => {
        return production.rightSide.includes(nonTerminal);
      }
    );

    
    if (productionsHasNonTerminal.length) {
      productionsHasNonTerminal.forEach((item) => {
        const indexNonTerminal = item.rightSide.indexOf(nonTerminal);
        const indexFollow = indexNonTerminal + 1;
        const follow = item.rightSide.substr(indexFollow);
        
        if (follow) {
          const first = this.firstSet.getFirst(follow);
          followSet = uniq([...followSet, ...first]).filter(item => {
            if(item != "ε" ) return item
          });
          const lastSymbolFollow = follow.slice(-1);

          if(this.symbolsVerifier.isTerminal(lastSymbolFollow)) {
            followSet = uniq([...followSet, lastSymbolFollow])
          }
          else {
            const firstLastSymbol = this.firstSet.getFirst(lastSymbolFollow);
            if(firstLastSymbol.includes("ε")) {
              followSet = uniq([...followSet, ...this.getFollowSet(item.leftSide)])
            }
          }
        }

        else {
          followSet = uniq([...followSet, ...this.getFollowSet(item.leftSide)]);
        }
      });
    }

    return followSet;
  }

  logger(label?: any, data?: any): void {
    if (this.isDebugger) {
      if (label) console.log(label);
      if (data) console.log(data);
    }
  }

  removeEpstonToFirst(first: Array<string>): Array<string> {
    return first.filter((item: string) => item != "ε");
  }
}
