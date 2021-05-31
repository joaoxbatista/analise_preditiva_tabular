import { Gramma } from "./Gramma";
import { Production } from "./Production";
import { union, uniq } from "lodash";

export type SetFirstObject = {
  nonTerminal: string;
  firstTerminals: Array<string>;
  linkedNonTerminals: Array<string>;
};
export class FirstSet {
  private gramma: Gramma;
  constructor(gramma: Gramma) {
    this.gramma = gramma;
  }

  // Função que retorna o array com o conjunto first
  public getArray(): any {
    const nonTerminals = this.gramma.getNonTerminals();
    const productions = this.gramma.getProductions();

    const firstArray: Array<{ nonTerminal: string; first: Array<string> }> = [];
    nonTerminals.forEach((item, index) => {
      const first: Array<string> = [];
      firstArray[index] = {
        nonTerminal: item,
        first,
      };
    });

    productions.forEach((production, index) => {
      const firstTerminals = this.getFirstOfProduction(production);
      firstArray[index].first = firstTerminals;
    });
    return firstArray;
  }

  // Função que retorna o array com o conjunto first
  public getArrayWithoutEpson(): any {
    const nonTerminals = this.gramma.getNonTerminals();
    const productions = this.gramma.getProductions();
    const firstArray = nonTerminals.map((item) => {
      const first: Array<string> = [];
      return {
        nonTerminal: item,
        first,
      };
    });
    productions.forEach((production, index) => {
      const firstTerminals = this.getFirstOfProduction(production);
      firstArray[index].first = firstTerminals.filter((item) => item != "ε");
    });
  }

  // Função recursiva para pegar todos os primeiros simbolos da lado direito de uma produção
  public getFirstOfProduction(production: Production): Array<string> {
    let firstSymbols: Array<string> = [];
    production.getRightSide().forEach((item) => {
      // console.log(`Right Side: ${item}`);
      // console.log(this.getFirst(item));
      firstSymbols = [...firstSymbols, ...this.getFirst(item)];
    });
    return union(firstSymbols);
  }

  // Função recursiva para pegar o primeiro simbolo da produção
  public getFirst(production: string): Array<string> {
    const firstSymbol = production[0];
    const isNonTerminal = this.gramma.getNonTerminals().includes(firstSymbol);
    console.log(`${firstSymbol}-->${production}<--`)
    if (isNonTerminal) {
      const firstSymbolProduction = this.gramma.findProduction(firstSymbol);
      let firstSymbols = this.getFirstOfProduction(firstSymbolProduction);
      const hasEmptySymbol = firstSymbols.includes("ε");
      if(hasEmptySymbol && production.length > 1) {
        firstSymbols = [...firstSymbols, ...this.getFirst(production.slice(1))];
      }
      console.log(firstSymbols);
      // Se o conjunto first contiver o simbolo vazio, pegar o proximo simbolo
      return firstSymbols;
      
    } else {
      console.log(`${firstSymbol}-->${production.slice(1)}<--`)
      if (firstSymbol == "ε" && production.length > 1) {
        const firstSymbols: Array<string> = [firstSymbol, ...this.getFirst(production.slice(1))];
        return firstSymbols;
      }
      else {
        console.log(`--*${firstSymbol}*--`)
        return [firstSymbol];
      }
    }
  }
}
