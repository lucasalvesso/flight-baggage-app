import Vue from "vue";
import Vuex from "vuex";
import { Auth } from "aws-amplify";
import moment from "moment";
import { API } from "@/util/ApiService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentSession: null,
    feedback: null,
    history: [],
    planes: [],
    flights: [],
    tickets: [],
    bases: [],
  },
  getters: {
    getHistory: (state) => state.history,
    getFeedback: (state) => state.feedback,
    getTickets: (state) => state.tickets,
    getCurrentSession: (state) => state.currentSession,
    getAirplanes: (state) => state.planes,
    getFlights: (state) => state.flights,
    getBases: (state) => state.bases,
  },
  mutations: {
    setFeedback: (state, payload) => {
      state.feedback = payload;
    },
    setCurrentSession: (state, payload) => {
      state.currentSession = payload;
    },
    setFiltererdTickets: (state, payload) => {
      state.filteredTickets = payload;
    },
    setNewAero: (state, payload) => {
      state.airplanes.push(payload);
    },
    setNewFlight: (state, payload) => {
      state.flights.push(payload);
    },
    setNewTicket: (state, payload) => {
      state.tickets.push(payload);
    },
    setNewBase: (state, payload) => {
      state.bases.push(payload);
    },
    setAirplanes: (state, payload) => {
      state.airplanes = payload;
    },
    editAirplanes: (state, payload) => {
      state.airplanes[payload.index].name = payload.body.name;
    },
    setHistory: (state, payload) => {
      state.history = payload;
    },
    setData: (state, payload) => {
      switch (payload.type) {
        case "force":
          state[payload.path] = payload.data;
          break;
        case "new":
          state[payload.path].push(payload.data);
          break;
        case "set":
          state[payload.path].push(...payload.data);
          break;
        case "delete":
          state[payload.path].splice(payload.index, 1);
          break;
        case "edit":
          state[payload.path].splice(payload.index, 1);
          state[payload.path].push(payload.data);
          break;
      }
    },
  },
  actions: {
    fetchHistory: async (context, params) => {
      API.get(params.path)
        .then((result) => {
          context.commit("setHistory", result.body);
        })
        .catch((e) => {
          console.log(e);
          context.commit("setFeedback", {
            code: 400,
            message: "Não foi possível obter a lista de aeronaves",
            color: "error",
            timeout: 2000,
          });
        });
    },

    fetchData: async (context, params) => {
      const filters = (() => {
        if (params.filter) {
          return (
            "?" +
            Object.keys(params.filter)
              .map((opt) => {
                return `${opt}=${params.filter[opt]}`;
              })
              .join(",")
          );
        } else {
          return "";
        }
      })();

      API.get(params.path + filters)
        .then((result) => {
          context.commit("setData", {
            path: params.path,
            data: result,
            type: params.type || "set",
          });
        })
        .catch((e) => {
          console.log(e);
          context.commit("setFeedback", {
            code: 400,
            message: "Não foi possível obter a lista de aeronaves",
            color: "error",
            timeout: 2000,
          });
        });
    },

    fetchNew: async (context, params) => {
      API.post(params.path, { body: params.data })
        .then((val) => {
          if (params.data.protocol === null) params.data.protocol = val.body;
          context.commit("setData", {
            path: params.path,
            data: params.data,
            type: "new",
          });
          context.commit("setFeedback", { code: 200, response: val });
        })
        .catch((e) => {
          console.log(e);
          context.commit("setFeedback", { code: 400, message: e });
        });
    },
    fetchDelete: async (context, params) => {
      API.del(`/${params.path}/${params.id}`)
        .then(() => {
          context.commit("setData", {
            path: params.path,
            index: params.index,
            type: "delete",
          });
          context.commit("setFeedback", {
            code: 200,
            message: "Excluído com sucesso",
          });
        })
        .catch((e) => {
          console.log(e);
          context.commit("setFeedback", { code: 400, message: e });
        });
    },
    fetchEdit: async (context, params) => {
      API.put(params.path, {
        body: params.body,
        oldData: params.oldData,
      })
        .then(() => {
          context.commit("setData", {
            path: params.path,
            index: params.index,
            data: params.body,
            type: "edit",
          });
          context.commit("setFeedback", { code: 200 });
        })
        .catch((e) => {
          console.log(e);
          context.commit("setData", {
            path: params.path,
            index: params.index,
            data: params.oldData,
            type: "edit",
          });
          context.commit("setFeedback", { code: 400, message: e });
        });
    },

    memorySave: async (context, params) => {
      const data = localStorage.getItem("tickets");
      const opts = [params];
      if (data) {
        JSON.parse(data).forEach((opt) => {
          opts.push(opt);
        });
      }
      localStorage.setItem("tickets", JSON.stringify(opts));

      switch (params.type) {
        case "fetchEdit":
          context.commit("setData", {
            path: params.data.path,
            index: context.getters.getTickets.findIndex(
              (opt) => opt.protocol === params.data.body.protocol
            ),
            data: params.data.body,
            type: "edit",
          });
          context.commit("setFeedback", { code: 200 });
      }
    },

    fetchMemorySaved: async () => {
      const items = localStorage.getItem("tickets");
      if (items) {
        const data = [...JSON.parse(items)];
        for (const [index, opt] of data.entries()) {
          opt.data.body.status = "closed";
          await API.put(opt.data.path, {
            body: opt.data.body,
            oldData: opt.data.oldData,
          }).then(() => {
            data.splice(index, 1);
            localStorage.setItem("tickets", JSON.stringify(data));
          });
        }
      }
    },

    memorySaveFlight: async (context, params) => {
      localStorage.setItem("flight-" + params.body.id, JSON.stringify(params));

      context.commit("setData", {
        path: params.path,
        index: context.getters.getFlights.findIndex(
          (opt) => opt.id === params.body.id
        ),
        data: params.body,
        type: "edit",
      });
      context.commit("setFeedback", { code: 200 });
    },

    fetchMemorySaveFlight: async (context, params) => {
      params.body.status = "closed";
      await API.put(params.path, {
        body: params.body,
        oldData: params.oldData,
      }).then(() => {
        // data.splice(index, 1);
        localStorage.removeItem("flight-" + params.body.id);
      });
    },

    fetchCurrentSession: async (context) => {
      await Auth.currentSession()
        .then((user) => {
          if (
            user &&
            user.idToken &&
            user.idToken.payload &&
            moment().unix() < user.idToken.payload.exp
          ) {
            context.commit("setCurrentSession", user.idToken.payload);
          } else {
            context.commit("setCurrentSession", {});
          }
        })
        .catch((e) => {
          console.error(e);
          context.commit("setCurrentSession", {});
        });
    },
  },
  modules: {},
});
