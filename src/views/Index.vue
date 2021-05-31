<template>
  <div>
    <!-- Entrada da gramática -->
    <div class="container divide-y-2 divide-gray-200">
      <div class="gramma__string flex">
        <textarea v-model="grammaString" class="mr-2 p-4"></textarea>
        <button @click="parseToGramma">Converter</button>
      </div>

      <div class="flex flex-wrap mt-4 -mx-2">
        <div class="card">
          <div class="card__title">Produções</div>
          <div class="card__content">
            <template v-if="gramma.productions">
              <div
                class="productions"
                v-for="(production, index) in gramma.productions"
                :key="`p-${index}`"
              >
                {{ production }}
              </div>
            </template>
          </div>
        </div>

        <div class="card">
          <div class="card__title">Não Terminais</div>
          <div class="card__content">
            <template v-if="gramma.productions">
              <div
                class="productions"
                v-for="(nonTerminal, index) in gramma.getNonTerminals()"
                :key="`nt-${index}`"
              >
                {{ nonTerminal }}
              </div>
            </template>
          </div>
        </div>

        <div class="card">
          <div class="card__title">Terminais</div>
          <div class="card__content">
            <template v-if="gramma.productions">
              <div
                class="productions"
                v-for="(terminal, index) in gramma.getTerminals()"
                :key="`t-${index}`"
              >
                {{ terminal }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap mt-4 -mx-2">
        <div class="card">
          <div class="card__title">Conjunto First</div>
          <div class="card__content">
            <div
              class="productions"
              v-for="(first, index) in firstSet"
              :key="`ff-${index}`"
            >
              {{ first.nonTerminal }}: {{ first.first }}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__title">Conjunto Follow</div>
          <div class="card__content">
            <div
              class="productions"
              v-for="(follow, index) in followSet"
              :key="`ffw-${index}`"
            >
              {{ follow.nonTerminal }}: {{ follow.follow }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap mt-4 -mx-2">
        <div class="card">
          <div class="card__title">Tabela Preditiva</div>
          <div class="card__content">
            <template v-if="preditiveTableHeader">
              <table class="border w-full">
                <thead>
                  <th class="border"></th>
                  <th
                    v-for="(terminal, index) in preditiveTableHeader"
                    :key="`th-${index}`"
                    class="border"
                  >
                    {{ terminal }}
                  </th>
                </thead>

                <tbody>
                  <tr
                    v-for="(cell, index) in preditiveTable"
                    :key="`td-${index}`"
                    class="border"
                  >
                    <th class="border">
                      {{ index }}
                    </th>
                    <td
                      v-for="(terminal, index) in preditiveTableHeader"
                      :key="`td-${index}-i`"
                      class="border"
                    >
                      {{ cell[terminal] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Gramma } from "@/classes/Gramma";
import { FirstSet } from "@/classes/FirstSet";
import { FollowSet } from "@/classes/FollowSet";
import { PreditiveTable } from "@/classes/PreditiveTable";
@Component({})
export default class Index extends Vue {
  grammaString = "A->bB\n B->c| ";
  gramma: Gramma | string = "";
  grammaResult = "";
  firstSet: Array<string> = [];
  followSet: Array<string> = [];
  preditiveTable: Array<string> = [];
  preditiveTableHeader: Array<string> = [];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async parseToGramma() {
    try {
      this.gramma = new Gramma(this.grammaString);
      const firstSet = new FirstSet(this.gramma);
      const followSet = new FollowSet(this.gramma);
      const preditiveTable = new PreditiveTable(this.gramma);
      this.firstSet = firstSet.getArray();
      this.followSet = followSet.getArray();
      this.preditiveTable = preditiveTable.generate();
      this.preditiveTableHeader = preditiveTable.getTerminals();
    } catch (e) {
      alert(e);
    }
  }
}
</script>

<style scoped lang="postcss">
.container {
  @apply max-w-screen-lg m-auto;
}
.card {
  @apply w-1/2 mt-2 text-left px-2 py-1;
}

.card__title {
  @apply text-lg font-bold text-white bg-blue-500 px-4 py-2 rounded;
}

.card__content {
  @apply bg-gray-50 rounded overflow-hidden;
}

.productions {
  @apply bg-gray-100 px-4 py-1 border border-b border-gray-200 text-lg;
}

.gramma__string {
  @apply mt-4;
}

button {
  @apply bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded;
}

textarea {
  @apply border-0 bg-gray-100 rounded w-full;
}
</style>
