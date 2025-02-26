import {
    Component, ComponentOptionsBase,
    ComponentOptionsMixin, ComponentProvideOptions,
    ComputedOptions, CreateComponentPublicInstanceWithMixins, Directive,
    EmitsOptions,
    ExtractDefaultPropTypes, GlobalComponents, GlobalDirectives,
    MethodOptions,
    PublicProps, SlotsType
} from "@vue/runtime-core";

export const data = [
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.iDPrZBDnI700R61YEzeTBgHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_0"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.KA8PmSilCkfFVrFrOj6kLwHaDn?w=348&h=171&c=7&r=0&o=5&pid=1.7",
        "name": "image_2"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.GzjJVCWF2dFArXuD570KhQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_3"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.O852elWzZ-I2_QtXXhyPtQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_4"
    },
    {
        "src": "https://tse1.mm.bing.net/th/id/OIP.KCtjglNkBl9uDGZOnZfqGAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_5"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.nWqpzH5VtEpj50pq-puThwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_6"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.HslUxqGnuRl41d9mpfQrCAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_7"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.aVlG44cf50kphqLSfNUQfAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_8"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.TGI-aI_RAzS4PTpi6A7RQAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_9"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.-ZpkAo4H3LWlUSr0FwuXCwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_10"
    },
    {
        "src": "",
        "name": "wakka",
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.iDPrZBDnI700R61YEzeTBgHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_0"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.KA8PmSilCkfFVrFrOj6kLwHaDn?w=348&h=171&c=7&r=0&o=5&pid=1.7",
        "name": "image_2"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.GzjJVCWF2dFArXuD570KhQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_3"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.O852elWzZ-I2_QtXXhyPtQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_4"
    },
    {
        "src": "https://tse1.mm.bing.net/th/id/OIP.KCtjglNkBl9uDGZOnZfqGAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_5"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.nWqpzH5VtEpj50pq-puThwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_6"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.HslUxqGnuRl41d9mpfQrCAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_7"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.aVlG44cf50kphqLSfNUQfAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_8"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.TGI-aI_RAzS4PTpi6A7RQAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_9"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.-ZpkAo4H3LWlUSr0FwuXCwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_10"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.iDPrZBDnI700R61YEzeTBgHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_0"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.nPCxV5y4I7Qdntlfc8kXkQHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_1"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.KA8PmSilCkfFVrFrOj6kLwHaDn?w=348&h=171&c=7&r=0&o=5&pid=1.7",
        "name": "image_2"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.GzjJVCWF2dFArXuD570KhQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_3"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.O852elWzZ-I2_QtXXhyPtQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_4"
    },
    {
        "src": "https://tse1.mm.bing.net/th/id/OIP.KCtjglNkBl9uDGZOnZfqGAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_5"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.nWqpzH5VtEpj50pq-puThwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_6"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.HslUxqGnuRl41d9mpfQrCAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_7"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.aVlG44cf50kphqLSfNUQfAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_8"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.TGI-aI_RAzS4PTpi6A7RQAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_9"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.-ZpkAo4H3LWlUSr0FwuXCwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_10"
    }, {
        "src": "https://tse2.mm.bing.net/th/id/OIP.iDPrZBDnI700R61YEzeTBgHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_0"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.nPCxV5y4I7Qdntlfc8kXkQHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_1"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.KA8PmSilCkfFVrFrOj6kLwHaDn?w=348&h=171&c=7&r=0&o=5&pid=1.7",
        "name": "image_2"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.GzjJVCWF2dFArXuD570KhQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_3"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.O852elWzZ-I2_QtXXhyPtQHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_4"
    },
    {
        "src": "https://tse1.mm.bing.net/th/id/OIP.KCtjglNkBl9uDGZOnZfqGAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_5"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.nWqpzH5VtEpj50pq-puThwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_6"
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.HslUxqGnuRl41d9mpfQrCAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_7"
    },
    {
        "src": "https://tse4.mm.bing.net/th/id/OIP.aVlG44cf50kphqLSfNUQfAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_8"
    },
    {
        "src": "",
        "name": "wakka",
    },
    {
        "src": "https://tse3.mm.bing.net/th/id/OIP.TGI-aI_RAzS4PTpi6A7RQAHaEo?w=238&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_9"
    },
    {
        "src": "https://tse2.mm.bing.net/th/id/OIP.-ZpkAo4H3LWlUSr0FwuXCwHaEK?w=266&h=180&c=7&r=0&o=5&pid=1.7",
        "name": "image_10"
    }
]

// export const data = [
//     {
//         "src": "https://tse2.mm.bing.net/th/id/OIP.iDPrZBDnI700R61YEzeTBgHaEK?w=320&h=180&c=7&r=0&o=5&pid=1.7",
//         "name": "image_0"
//     }
// ]

export type DefineComponent<
    PropsOrPropOptions = {},  // 组件的 props 类型
    RawBindings = {}, // 组件的绑定类型
    D = {}, // 组件的 data 类型
    C extends ComputedOptions = ComputedOptions, // 组件的 computed 类型
    M extends MethodOptions = MethodOptions,  // 组件的 methods 类型
    Mixin extends ComponentOptionsMixin = ComponentOptionsMixin, // 组件的 mixins 类型
    Extends extends ComponentOptionsMixin = ComponentOptionsMixin, // 组件的 extends 类型
    E extends EmitsOptions = {}, EE extends string = string,  // 组件的 emits 类型
    PP = PublicProps, // 组件的 publicProps 类型
    Props = ResolveProps<PropsOrPropOptions, E>, // 组件的 props 类型
    Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>, // 组件的默认 props 类型
    S extends SlotsType = {}, // 组件的 slots 类型
    LC extends Record<string, Component> = {}, // 组件的 components 类型
    Directives extends Record<string, Directive> = {}, // 组件的 directives 类型
    Exposed extends string = string, // 组件的 exposed 类型
    Provide extends ComponentProvideOptions = ComponentProvideOptions,// 组件的 provide 类型
    MakeDefaultsOptional extends boolean = true, // 组件的默认 props 是否可选类型
    TypeRefs extends Record<string, unknown> = {},// 组件的 typeRefs 类型
    TypeEl extends Element = any // 组件的 el 类型
> = ComponentPublicInstanceConstructor<
        CreateComponentPublicInstanceWithMixins<
            Props,
            RawBindings,
            D,
            C,
            M,
            Mixin,
            Extends,
            E,
            PP,
            Defaults,
            MakeDefaultsOptional,
            {},
            S,
            LC & GlobalComponents,
            Directives & GlobalDirectives,
            Exposed,
            TypeRefs,
            TypeEl
        >
    > & ComponentOptionsBase<
    Props, RawBindings, D, C, M, Mixin, Extends, E, EE, Defaults, {}, string, S, LC & GlobalComponents, Directives & GlobalDirectives, Exposed, Provide>
    & PP;
